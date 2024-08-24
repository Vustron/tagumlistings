<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;


Route::middleware('guest')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected routes
Route::middleware(['auth:sanctum', 'check.token.expiration'])->group(function () {
    // User management routes
    Route::put('/user/update', [AuthController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Client routes
    Route::middleware('role:client')->group(function () {
        Route::get('/client', [PropertyController::class, 'client']);
    });

    // Client representative routes
    Route::middleware('role:client_representative')->group(function () {
        Route::apiResource('property', PropertyController::class);
        Route::put('/reserve/property/{property}', [PropertyController::class, 'reserve']);
        Route::put('/sold/property/{property}', [PropertyController::class, 'sold']);
    });
});


