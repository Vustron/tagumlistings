<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// User management routes
Route::get('/account/get', [AuthController::class, 'getAllAccounts']);
Route::get('/account/get/{id}', [AuthController::class, 'getAccountByID']);
Route::patch('/account/update/{id}', [AuthController::class, 'updateAccount']);

// Protected routes
Route::middleware(['web', 'auth:sanctum', 'check.token.expiration'])->group(function () {

    Route::delete('/account/delete/{id}', [AuthController::class, 'deleteAccount']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Client routes
    Route::middleware('role:client')->group(function () {
        Route::get('/payment/history/{property_id}', [PaymentController::class, 'getPaymentHistory']);

        Route::get('/all/available/property', [PropertyController::class, 'searchAvailablePropertyDetails']);
        Route::get('/property/{status}', [PropertyController::class, 'getPropertyByStatus']);

        Route::post('/request/appointment', [AppointmentController::class, 'requestAppointment']);
    });


    // Client representative routes
    Route::middleware('role:company_representative')->group(function () {
        Route::get('/get/accounts', [AuthController::class, 'getAllAccounts']);


        Route::apiResource('property', PropertyController::class);
        Route::apiResource('appointments', AppointmentController::class);

        Route::patch('/confirm/appointment/{appointment_id}', [AppointmentController::class, 'confirmAppointmentRequest']);

        Route::get('/monthly/reports/{status}', [PaymentController::class, 'monthlyReports']);
        Route::post('/add/payment', [PaymentController::class, 'addPayment']);

        Route::patch('/reserve/property/{property_id}', [PropertyController::class, 'reserve']);
        Route::patch('/sold/property/{property_id}', [PropertyController::class, 'sold']);
    });
});


