<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    
    Route::middleware('role:client')->group(function () {
        Route::get('/client', [PropertyController::class, 'client']);
    });

    Route::middleware('role:client_representative')->group(function () {
        Route::get('/client_representative', [PropertyController::class, 'client_representative']);
    });

    Route::put('/user/update', [AuthController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
});


