<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
// Vustron: akung gi butngan ug try catch kay mu success pero wla nasave sa db
// gi optional ranang name ug role tas hash ang password
    public function register(Request $request)
    {
        try {
            // Validate the incoming request
            $data = $request->validate([
                "username" => 'required|string|unique:users,username',
                "email" => "required|string|email|unique:users,email",
                "password" => "required|string|min:8",
                "name" => "nullable|string",
                "role" => "nullable|string"
            ]);

            // Hash the password
            $data['password'] = Hash::make($data['password']);

            // Create the user
            $user = User::create([
                'username' => $data['username'],
                'email' => $data['email'],
                'password' => $data['password'],
                'name' => $data['name'] ?? null,
                'role' => $data['role'] ?? 'client'
            ]);

            // Create token
            $token = $user->createToken($data['username'])->plainTextToken;

            // Return response
            return response()->json([
                "message" => "Registered Successfully",
                "user" => $user,
                "token" => $token
            ], 201);
        } catch (\Exception $e) {
            // Log the error
            \Log::error('Registration failed: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());

            return response()->json([
                "message" => "Registration failed",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            "username" => "required",
            "password" => "required"
        ]);


        $user = User::where('username', $data["username"])->first();

        if($user && Hash::check($data["password"], $user->password)){
            $user->tokens()->delete();

            $expiration = now()->addHours(2);
            $token = $user->createToken($data['username'], ['expiration' => $expiration])->plainTextToken;

            return response()->json([
                "message" => "Login Successfully",
                "token"   => $token,
                'token_expires_at' => $expiration
            ], 200);
        }

        return response()->json([
            "message" => "Invalid Credentials"
        ], 401);

    }


    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            "name" => "required",
            "username" => "required",
            "email" => "required|email|unique:users",
            "password" => "required"
        ]);


        if(isset($data['password'])){
            $data['password'] = Hash::make($data['password']);
        }

        unset($data['role']);
        $user->update($data);

        return response()->json([
            "message" => "User updated successfully",
            "user" => $user
        ], 200);
    }


    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

// Vustron: kani kay mu return ra sa tanan users nga na save sa db
    public function getAllUsers()
    {
        $users = User::all();

        return response()->json([
            "message" => "Users retrieved successfully",
            "users" => $users
        ], 200);
    }
}
