<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;


Route::middleware(['web', 'guest'])->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected routes
Route::middleware(['web', 'auth:sanctum', 'check.token.expiration'])->group(function () {

    // User management routes
    Route::get('/get/profile', [AuthController::class, 'getProfile']);
    Route::get('/get/accounts', [AuthController::class, 'getAllAccounts']);
    Route::get('/get/account/{id}', [AuthController::class, 'getAccountByID']);

    Route::patch('/account/update/{id}', [AuthController::class, 'updateAccount']);
    Route::delete('/account/delete/{id}', [AuthController::class, 'deleteAccount']);
    Route::post('/logout', [AuthController::class, 'logout']);


    // Client routes
    Route::middleware('role:client')->group(function () {
        Route::get('/payment/history/{property_id}', [PaymentController::class, 'getPaymentHistory']);
    });

    
    // Client representative routes
    Route::middleware('role:company_representative')->group(function () {
        Route::apiResource('property', PropertyController::class);
        Route::apiResource('appointments', AppointmentController::class);

        Route::post('/add/payment', [PaymentController::class, 'addPayment']);
        Route::patch('/reserve/property/{property}', [PropertyController::class, 'reserve']);
        Route::patch('/sold/property/{property}', [PropertyController::class, 'sold']);
    });

});


