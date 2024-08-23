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

        if(!$user || !Hash::check($data["password"], $user->password)){
            return response()->json([
                "message" => "Invalid Credentials"
            ], 401);
        }

        $token = $user->createToken($data['username'])->plainTextToken;
        // $cookie = cookie('auth_token', $token, 60 * 24, "/", "localhost", false, true, false, 'None');


        return response()->json([
            "message" => "Login Successfully",
            "token" => $token
        ], 200);

    }
}
