<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        try {

            $data = $request->validate([
                "name" => "nullable|string",
                "address" => "nullable|string",
                "contact_number" => "nullable|string",
                "email" => "required|string|email|unique:users,email",
                "password" => "required|string|min:8",
                "role" => "nullable|string"
            ]);

            $data['password'] = Hash::make($data['password']);

            User::create([
                'name' => $data['name'],
                'address' => $data['address'],
                'contact_number' => $data['contact_number'],
                'email' => $data['email'],
                'password' => $data['password'],
                'name' => $data['name'] ?? null,
                'role' => $data['role'] ?? 'client'
            ]);


            return response()->json(["message" => "Registered Successfully"], 201);
            
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

            $request->validate([
                "email" => "required|exists:users,email",
                "password" => "required"
            ]);
    
    
            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }
    
            $request->session()->regenerate();
    
            return response()->json(['message' => 'Login successful']);;

        } catch (\Exception $e) {

            Log::error('Login failed: ' . $e->getMessage());

            return response()->json([
                "message" => "Login Error",
                "error"   => $e->getMessage()
            ], 401);
        }
       
    }


    public function getProfile(){
        $authenticatedUser = Auth::user();
        return response()->json(['user' => $authenticatedUser], 200);
    }

    public function getAllAccounts()
    {

        try {

            $users = User::all();

            return response()->json([
                "message" => "Accounts retrieved successfully",
                "users" => $users
            ], 200);

        } catch (\Exception $e){
            return response()->json(['error' => "Internal Server Error Occurred: {$e}"], $e->getCode());
        }
       
    }


    public function getAccountByID(string $id)
    {
        try {

            $users = User::findOrFail($id);
            return response()->json(['user' => $users], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Account not found',
                'error'   => $e->getMessage()
            ], 404);

        } catch (\Exception $e){
            return response()->json(['error' => "Internal Server Error Occurred: {$e}"], $e->getCode());
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
           
        } catch (\Exception $e){
            Log::error('Update Account Failed:' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json(['error' => "Internal Server Error Occurred: {$e}"], $e->getCode());
        }
        
    }


    public function deleteAccount(string $id)
    {
        try {

           $user = User::findOrFail($id);
           $user->delete();

           return response()->json(['message' => 'Account Deleted Successfully'], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Account not found',
                'error'   => $e->getMessage()
            ], 404);

        } catch (\Exception $e){
            return response()->json(['error' => "Internal Server Error Occurred: {$e}"], $e->getCode());
        }
    }



    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
