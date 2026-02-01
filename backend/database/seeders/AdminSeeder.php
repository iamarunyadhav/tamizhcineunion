<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        if (UserRole::where('role', 'admin')->exists()) {
            return;
        }

        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
            ]
        );

        UserRole::firstOrCreate([
            'user_id' => $user->id,
            'role' => 'admin',
        ]);
    }
}
