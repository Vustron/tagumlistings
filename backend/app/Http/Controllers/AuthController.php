<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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

            $user = User::create([
                'name' => $data['name'],
                'address' => $data['address'],
                'contact_number' => $data['contact_number'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => $data['role'] ?? 'client'
            ]);

            return response()->json($user, 200);
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

            $user = User::where('email', $request->email)->first();

            return response()->json($user, 200);
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
            return response()->json(['accounts' => $users], 200);
        } catch (\Exception $e) {
            Log::error('Error retrieving accounts: ' . $e->getMessage());
            return response()->json([
                'error' => "An error occurred while retrieving accounts. Please try again later."
            ], 500);
        }
    }

    public function getAccountByID(string $id)
    {
        try {
            $user = User::findOrFail($id);
            return response()->json($user, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Account not found',
                'error'   => $e->getMessage()
            ], 404);
        } catch (\Exception $e){
            return response()->json([
                'error' => "Internal Server Error Occurred: {$e}"
            ], 500);
        }
    }

    public function updateAccount(Request $request, string $id)
    {
        try {
            $data = $request->validate([
                "name" => "nullable|string",
                "address" => "nullable|string",
                "contact_number" => "nullable|string",
                "email" => "nullable|string|email|unique:users,email",
                "password" => "nullable|string|min:8",
                "newpassword" => "nullable|string|min:8",
                "role" => "nullable|string"
            ]);

            $user = User::findOrFail($id);

            if (!empty($data['password']) && !empty($data['newpassword'])) {
                if (!Hash::check($data['password'], $user->password)) {
                    return response()->json([
                        'error' => 'Current password is incorrect.'
                    ], 400);
                }

                if ($data['password'] === $data['newpassword']) {
                    return response()->json([
                        'error' => 'New password cannot be the same as the current password.'
                    ], 400);
                }

                $user->password = Hash::make($data['newpassword']);
            }

            $user->fill($data);
            $user->save();

            return response()->json($user, 200);
        } catch (\Exception $e){
            Log::error('Update Account Failed: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json([
                'error' => "Internal Server Error Occurred: {$e}"
            ],$e->getCode() ?: 500);
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
