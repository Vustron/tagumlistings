<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;

// Vustron: kaning users kay pang-test ra kung nasave ba sa db

// Public routes
Route::get('/users', [AuthController::class, 'getAllUsers']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User management routes
    Route::put('/user/update', [AuthController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Client routes
    Route::middleware('role:client')->group(function () {
        Route::get('/client', [PropertyController::class, 'client']);
    });

    // Client representative routes
    Route::middleware('role:client_representative')->group(function () {
        Route::get('/client_representative', [PropertyController::class, 'client_representative']);
    });
});


