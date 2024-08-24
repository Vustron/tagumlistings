<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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

            Log::error('Registration failed: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                "message" => "Registration failed",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {

        try {

            $data = $request->validate([
                "username" => "required|exists:users,username",
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

        } catch (\Exception $e) {

            Log::error('Login failed: ' . $e->getMessage());

            return response()->json([
                "message" => "Login Error",
                "error"   => $e->getMessage()
            ], 401);
        }
       
    }

    public function getAllAccounts()
    {

        try {

            $users = User::all();

            return response()->json([
                "message" => "Accounts retrieved successfully",
                "users" => $users
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => "Internal Server Error Occurred: {$e}"], 500);
        }
       
    }


    public function getAccountByID(string $id)
    {
        try {

            $users = User::findOrFail($id);
            return response()->json(['user' => $users], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Account not found'], 404);

        } catch (\Exception $e) {
            return response()->json(['error' => "Internal Server Error Occurred: {$e}"], 500);
        }
    }



    public function updateAccount(Request $request, string $id)
    {

        try {

            $data = $request->validate([
                "name" => "nullable|string",
                "username" => "required",
                "email" => "required|email|unique:users",
                "password" => "nullable|string|min:8|confirmed"
            ]);

            $user = User::findOrFail($id);
            $user->fill($data);

            if(!empty($data['password'])){
                $user->password = Hash::make($data['password']);
            }

            $user->save();


            return response()->json([
                "message" => "User updated successfully",
                "user" => $user
            ], 200);
           
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Account Update Error',
                'error'   =>  $e->getMessage()
            ], 500);
        }
        
    }


    public function deleteAccount(string $id)
    {
        try {

           $user = User::findOrFail($id);
           $user->delete();

           return response()->json(['message' => 'Account Deleted Successfully'], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Account Not Found'], 404);

        }catch (\Exception $e) {
            return response()->json(['error' => "Internal Server Error Occurred: {$e}"], 500);
        }
    }



    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
