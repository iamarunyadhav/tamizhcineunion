<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MemberProfile;
use App\Models\MembershipApplication;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) ($request->input('per_page') ?? 50);
        $search = $request->input('search');
        $members = User::with(['roles', 'profile'])
            ->whereHas('roles', function ($query) {
                $query->where('role', 'member');
            })
            ->when($search, function ($query, $search) {
                $query->where(function ($inner) use ($search) {
                    $inner->where('name', 'like', '%'.$search.'%')
                        ->orWhere('email', 'like', '%'.$search.'%');
                });
            })
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return response()->json($members);
    }

    public function show(User $member)
    {
        if (!$member->isMember()) {
            abort(404, 'Member not found.');
        }

        return response()->json($member->load(['roles', 'profile']));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'application_id' => ['nullable', 'exists:membership_applications,id'],
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'date_of_birth' => ['nullable', 'date'],
            'phone' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'skills' => ['nullable', 'array'],
            'bio' => ['nullable', 'string'],
            'portfolio_links' => ['nullable', 'array'],
            'profile_photo' => ['nullable', 'string', 'max:2048'],
        ]);

        $application = null;
        if (!empty($data['application_id'])) {
            $application = MembershipApplication::findOrFail($data['application_id']);
        }

        $name = $data['name'] ?? $application?->name;
        $email = $data['email'] ?? $application?->email;

        if (!$name || !$email) {
            throw ValidationException::withMessages([
                'email' => ['Name and email are required to create a member account.'],
            ]);
        }

        if (User::where('email', $email)->exists()) {
            throw ValidationException::withMessages([
                'email' => ['A user with this email already exists.'],
            ]);
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($data['password']),
        ]);

        UserRole::create([
            'user_id' => $user->id,
            'role' => 'member',
        ]);

        $profile = MemberProfile::create([
            'user_id' => $user->id,
            'membership_application_id' => $application?->id,
            'date_of_birth' => $data['date_of_birth'] ?? $application?->date_of_birth,
            'phone' => $data['phone'] ?? $application?->phone,
            'location' => $data['location'] ?? $application?->location,
            'category' => $data['category'] ?? $application?->category,
            'skills' => $data['skills'] ?? $application?->skills,
            'bio' => $data['bio'] ?? $application?->bio,
            'portfolio_links' => $data['portfolio_links'] ?? $application?->portfolio_links,
            'profile_photo' => $data['profile_photo'] ?? $application?->profile_photo,
        ]);

        if ($application && $application->status !== 'approved') {
            $application->update(['status' => 'approved']);
        }

        return response()->json([
            'user' => $user->load(['roles', 'profile']),
            'profile' => $profile,
        ], 201);
    }

    public function update(Request $request, User $member)
    {
        if (!$member->isMember()) {
            abort(404, 'Member not found.');
        }

        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255', 'unique:users,email,'.$member->id],
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
            $member->name = $data['name'];
        }

        if (!empty($data['email'])) {
            $member->email = $data['email'];
        }

        if (!empty($data['password'])) {
            $member->password = Hash::make($data['password']);
        }

        $member->save();

        $profileData = collect($data)
            ->only(['date_of_birth', 'phone', 'location', 'category', 'skills', 'bio', 'portfolio_links', 'profile_photo'])
            ->toArray();

        $profile = $member->profile ?? new MemberProfile(['user_id' => $member->id]);
        $profile->fill($profileData);
        $profile->save();

        return response()->json($member->load(['roles', 'profile']));
    }

    public function destroy(User $member)
    {
        if (!$member->isMember()) {
            abort(404, 'Member not found.');
        }

        $member->delete();

        return response()->json(status: 204);
    }
}
