<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function adminExists()
    {
        $exists = UserRole::where('role', 'admin')->exists();
        return response()->json(['exists' => $exists]);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $adminExists = UserRole::where('role', 'admin')->exists();

        if ($adminExists && (!$request->user() || !$request->user()->isAdmin())) {
            abort(403, 'Only admins can create additional admin accounts.');
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        UserRole::create([
            'user_id' => $user->id,
            'role' => 'admin',
        ]);

        $token = $user->createToken('auth_token', ['admin'])->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'is_admin' => true,
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        /** @var \App\Models\User $user */
        $user = $request->user();
        $abilities = $user->isAdmin() ? ['admin'] : ['user'];
        $token = $user->createToken('auth_token', $abilities)->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'is_admin' => $user->isAdmin(),
                'is_member' => $user->isMember(),
            ],
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'is_admin' => $user->isAdmin(),
            'is_member' => $user->isMember(),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
