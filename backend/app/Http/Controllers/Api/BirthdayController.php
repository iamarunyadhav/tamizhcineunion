<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artist;
use App\Models\MemberProfile;
use Carbon\Carbon;

class BirthdayController extends Controller
{
    public function today()
    {
        $today = Carbon::now();

        $artists = Artist::query()
            ->whereNotNull('date_of_birth')
            ->whereMonth('date_of_birth', $today->month)
            ->whereDay('date_of_birth', $today->day)
            ->get()
            ->map(function (Artist $artist) {
                return [
                    'id' => $artist->id,
                    'name' => $artist->name,
                    'photo' => $artist->photo,
                    'type' => 'artist',
                    'slug' => $artist->slug,
                    'date_of_birth' => optional($artist->date_of_birth)->toDateString(),
                ];
            });

        $members = MemberProfile::query()
            ->with('user')
            ->whereNotNull('date_of_birth')
            ->whereMonth('date_of_birth', $today->month)
            ->whereDay('date_of_birth', $today->day)
            ->get()
            ->map(function (MemberProfile $profile) {
                return [
                    'id' => $profile->user_id,
                    'name' => $profile->user?->name ?? 'Member',
                    'photo' => $profile->profile_photo,
                    'type' => 'member',
                    'date_of_birth' => optional($profile->date_of_birth)->toDateString(),
                ];
            });

        return response()->json([
            'data' => $artists->merge($members)->values(),
        ]);
    }
}
