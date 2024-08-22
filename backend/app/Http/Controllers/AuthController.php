<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(Request $request){
        $fields = $request->validate([
            "name" => "required",
            "username" => 'required',
            "email" => "required|email|unique:users",
            "password" => "required|confirmed",
            "role" => "required"
        ]);

        $user = User::create($fields);
        $token = $user->createToken($request->name)->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }
}
