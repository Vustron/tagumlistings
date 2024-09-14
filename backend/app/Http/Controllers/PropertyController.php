<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PropertyController extends Controller
{
    // Client API Methods
    public function searchAvailablePropertyDetails(Request $request)
    {
        $properties = Property::query()
            ->when($request->price, function ($query) use ($request) {
                $query->where('price', floatval($request->price));
            })
            ->when($request->reservation_fee, function ($query) use ($request) {
                $query->where('reservation_fee', floatval($request->reservation_fee));
            })
            ->when($request->search, function ($query) use ($request) {
                $searchTerm = strtolower($request->search);

                $query->where(function ($query) use ($searchTerm) {
                    $query->whereRaw('LOWER(category) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhere('location', 'like', "%{$searchTerm}%");
                });
            })
            ->where('status', '=', 'available')
            ->paginate(10);

        return response()->json($properties, 200);
    }

    public function getPropertyByStatus(string $status)
    {
        try {
            
            $properties = Property::select('id', 'property_name', 'description', 'location', 'price')
                          ->where('status', '=', $status)
                          ->where('user_id', '=', Auth::id())
                          ->get();

            return $properties;

        } catch (\Exception $e) {

            Log::error('Fetching Property Request Failed:' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'message' => 'Fetching Property Error',
                'error' => $e->getMessage(),
            ], $e->getCode());
        }
    }

  
    // Company Representative API Methods

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
        try {
            $data = $request->validate([
                'property_name' => 'nullable|string',
                'description' => 'nullable|string',
                'category' => 'required',
                'location' => 'required',
                'price' => 'required|numeric',
                'reservation_fee' => 'required|numeric',
            ]);
    
            $property->update($data);
    
            return response()->json([
                'message' => 'Property Updated Successfully',
                'property' => $property,
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Updating Property Error',
                'error' => $e->getMessage(),
            ], $e->getCode());
        }
       

      
    }

   
    public function destroy(Property $property)
    {
        $property->delete();

        return response()->json([
            'message' => 'Property Deleted Successfully'
        ]);
    }


    public function reserve(Request $request, string $property_id)
    {
        
        try {

            $data = $request->validate([
                'user_id' => 'required|numeric'
            ]);
    
            DB::beginTransaction();

            $property = Property::findOrFail($property_id);

            $propertyStatusUpdated = $property->update([
                'status' => 'reserved',
                'user_id' => $data['user_id'],
            ]);

            if($propertyStatusUpdated){
                DB::commit();
    
                return response()->json([
                    'message' => 'Property Reserved Successfully',
                    'property' => $property,
                ], 200);
            } 

        } catch (\Exception $e){
            DB::rollBack();
            Log::error('Transaction failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'Property Reservation Error',
                'error'   => $e->getMessage()
            ], $e->getCode());
        }
      
    }

    public function sold(Request $request, string $property_id)
    {

        try {

            $data = $request->validate([
                'user_id' => 'required',
            ]);
    
            DB::beginTransaction();

            $property = Property::findOrFail($property_id);

            $propertyStatusUpdated = $property->update([
                'status' => 'sold',
                'user_id' => $data['user_id'],
            ]);

            if($propertyStatusUpdated){
                DB::commit();

                return response()->json([
                    'message' => 'Property Sold Successfully',
                    'property' => $property,
                ], 200);
                    
            }

        } catch (\Exception $e){
            DB::rollBack();
            Log::error('Transaction failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'Property Sold Error',
                'error'   => $e->getMessage()
            ], $e->getCode());
        }

    }

}
