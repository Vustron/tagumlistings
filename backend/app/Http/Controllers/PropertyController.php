<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Property;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PropertyController extends Controller
{
  
    public function index(Request $request)
    {
        $properties = Property::query()
            ->when($request->status, function ($query) use ($request) {
                $query->where('status', strtolower($request->status));
            })
            ->when($request->price, function ($query) use ($request) {
                $query->where('price', floatval($request->price));
            })
            ->when($request->search, function ($query) use ($request) {
                $searchTerm = strtolower($request->search);

                $query->where(function ($query) use ($searchTerm) {
                    $query->whereRaw('LOWER(category) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhere('location', 'like', "%{$searchTerm}%");
                });
            })
            ->paginate(10)
            ->withQueryString();
        
        return response()->json($properties, 200);
    }

  
    public function store(Request $request)
    {
        $data = $request->validate([
            'property_name' => 'nullable|string',
            'description' => 'nullable|string',
            'category' => 'required',
            'location' => 'required',
            'price' => 'required|numeric',
            'reservation_fee' => 'required|numeric',
        ]);

        $property = Property::create($data);

        return response()->json([
            'message' => 'Property Created Successfully',
            'property' => $property  
        ], 201);

    }

   
    public function show(string $id)
    {
        return 'show';
    }

 
    public function update(Request $request, Property $property)
    {
        $data = $request->validate([
            'property_name' => 'nullable|string',
            'description' => 'nullable|string',
            'category' => 'required',
            'location' => 'required',
            'price' => 'required',
            'reservation_fee' => 'required',
        ]);

        $property->update($data);

        return response()->json([
            'message' => 'Property Updated Successfully',
            'property' => $property,
        ], 200);

      
    }

   
    public function destroy(Property $property)
    {
        $property->delete();

        return response()->json([
            'message' => 'Property Deleted Successfully'
        ]);
    }


    public function reserve(Request $request, Property $property)
    {
        
        try {

            $data = $request->validate([
                'user_id' => 'required',
                'appointment_date' => 'required|date_format:Y-m-d H:i:s'
            ]);
    
            DB::beginTransaction();

            $propertyStatusUpdated = $property->update([
                'status' => 'reserved',
                'user_id' => $data['user_id'],
            ]);

            if($propertyStatusUpdated){

                $existingAppointment = Appointment::where('property_id', $property->id)->first();

                if ($existingAppointment) {
                    return response()->json([
                        'message' => 'An appointment already exists for this user and property.',
                        'appointment_id' => $existingAppointment->id,
                    ], 409); 
                }
    

                $appointment = Appointment::create([
                    'appointment_date'  => $data['appointment_date'],
                    'user_id'           => $data['user_id'],
                    'property_id'       => $property->id,
                ]);

                DB::commit();
    
                return response()->json([
                    'message' => 'Property Reserved Successfully',
                    'property' => $property,
                    'appointment_id' => $appointment->id,
                ], 200);

    
            } 

        } catch (\Exception $e){
            DB::rollBack();
            Log::error('Transaction failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'Property Reservation Error',
                'error'   => $e->getMessage()
            ], 500);
        }
      
    }

    public function sold(Request $request, Property $property)
    {

        try {

            $data = $request->validate([
                'user_id' => 'required',
            ]);
    
            DB::beginTransaction();

            $propertyStatusUpdated = $property->update([
                'status' => 'sold',
                'user_id' => $data['user_id'],
            ]);

            if($propertyStatusUpdated){
                $appointment = Appointment::where('property_id', $property->id);

                if($appointment){
                    $appointment->delete();

                    DB::commit();

                    return response()->json([
                        'message' => 'Property Sold Successfully',
                        'property' => $property,
                    ], 200);
                }
                    
            }

        } catch (\Exception $e){
            DB::rollBack();
            Log::error('Transaction failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'Property Sold Error',
                'error'   => $e->getMessage()
            ], 500);
        }

    }

}
