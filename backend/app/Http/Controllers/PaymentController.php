<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Property;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
            
            DB::beginTransaction();

            $isReserved = Property::select('id')
                        ->where('status', 'reserved')
                        ->where('user_id', '=', $data['user_id'])
                        ->where('id', '=', $data['property_id'])
                        ->first();
            
            if($isReserved){
                Payment::create($data);

                DB::commit();
    
                return response()->json([
                    'message' => 'Payment Success',
                    'property_id'   => $data['property_id'],
                    'user_id' => $data['user_id'],
                    'amount' => $data['amount']
                ], 201);
            }

            return response()->json([
                'message' => "The Property is not reserved by user with id of: {$data['user_id']}",
            ], 404);
            
        }catch (\Exception $e){
            DB::rollBack();
            Log::error('Adding Payment Failed: ' . $e->getMessage());

            return response()->json(['error' => "Internal Server Error: {$e}"], 500);
        }
    }

    
    public function monthlyReports(string $status)
    {
        try {
            $currentYear = Carbon::now()->year;

            $monthlyReports = Payment::select(
                DB::raw("TO_CHAR(payment.created_at, 'Month') as month"),
                DB::raw("SUM(payment.amount) total_amount")
            ) 
            ->join('properties', 'payment.property_id', '=', 'properties.id')
            ->whereYear('payment.created_at', $currentYear)
            ->where('properties.status', $status)
            
            ->groupBy(DB::raw("TO_CHAR(payment.created_at, 'Month')"))
            ->orderBy(DB::raw("TO_DATE(TO_CHAR(payment.created_at, 'Month'), 'Month')")) 
            ->get();

            return response()->json([
                'monthly_reports' => $monthlyReports,
            ], 200);

        } catch (\Exception $e){
            Log::error('Fetching Reports Failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'Monthly Reservation Reports Error',
                'error'   => $e->getMessage()
            ], $e->getCode());
        }
    }


}
