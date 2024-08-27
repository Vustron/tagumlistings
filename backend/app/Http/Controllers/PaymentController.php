<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    
    public function getPaymentHistory(string $property_id)
    {
        try {
           $payment = DB::table('properties')
                        ->join('payment', function ($join) use ($property_id) {
                            $join->on('properties.id', '=', 'payment.property_id')
                                ->where('properties.id', '=', $property_id)
                                ->where('properties.user_id', '=', Auth::id());
                        })
                        ->join('users', 'properties.user_id', '=', 'users.id') 
                        ->select('users.name', 'users.email', 'properties.property_name', 'payment.amount', 'payment.created_at as transaction_date') 
                        ->get();

            return response()->json([
                'payment_history' => $payment,
                'property_id'     => $property_id
            ], 200);
            
        } catch (\Exception $e){
            return response()->json(['error' => "Internal Server Error Occurred: {$e}"], $e->getCode());
        }
    }


    public function addPayment(Request $request)
    {
        try {

            $data = $request->validate([
                'property_id' => 'required',
                'user_id' => 'required',
                'amount' => 'required',
                'mode_of_payment' => 'required|string',
            ]);

            Payment::create($data);

            return response()->json([
                'message' => 'Payment Success',
                'property_id'   => $data['property_id']
            ], 201);
            
        }catch (\Exception $e){
            return response()->json(['error' => "Internal Server Error Occurred: {$e}"], $e->getCode());
        }
    }
}
