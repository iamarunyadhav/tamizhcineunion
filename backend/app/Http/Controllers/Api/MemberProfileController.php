<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MemberProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class MemberProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $profile = $user?->profile;

        return response()->json([
            'user' => [
                'id' => $user?->id,
                'name' => $user?->name,
                'email' => $user?->email,
            ],
            'profile' => $profile,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'min:6'],
            'date_of_birth' => ['nullable', 'date'],
            'phone' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'skills' => ['nullable', 'array'],
            'bio' => ['nullable', 'string'],
            'portfolio_links' => ['nullable', 'array'],
            'profile_photo' => ['nullable', 'string', 'max:2048'],
        ]);

        if (!empty($data['name'])) {
            $user->name = $data['name'];
        }

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        $profileData = collect($data)
            ->only(['date_of_birth', 'phone', 'location', 'category', 'skills', 'bio', 'portfolio_links', 'profile_photo'])
            ->toArray();

        $profile = $user->profile ?? new MemberProfile(['user_id' => $user->id]);
        $profile->fill($profileData);
        $profile->save();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'profile' => $profile,
        ]);
    }
}
