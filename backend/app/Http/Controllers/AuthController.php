<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            "name" => "required",
            "username" => 'required',
            "email" => "required|email|unique:users",
            "password" => "required|confirmed",
            "role" => "required"
        ]);

        $user = User::create($data);

        $token = $user->createToken($data['username'])->plainTextToken;

        return response()->json([
            "message" => "Registered Successfully",
            "user" => $user,
            "token" => $token
        ], 201);
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
}
