<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Property;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AppointmentController extends Controller
{
    
    public function index()
    {
        try {
           $appointments = DB::table('appointments')
                        ->join('users', 'appointments.user_id', '=', 'users.id')
                        ->join('properties', 'appointments.property_id', '=', 'properties.id')
                        ->select(
                            'appointments.id',
                            'appointments.appointment_date', 
                            'users.name as name', 
                            'users.email as email', 
                            'properties.category', 
                            'properties.location'
                        )
                        ->paginate(10);

            return response()->json($appointments, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Getting Appointments Error',
                'error' => $e->getMessage(),
            ], 500);
        }
      
    }

    
    public function store(Request $request)
    {
        return 'store';
    }

    
    public function show(string $id)
    {

        try {

            $appointment = Appointment::findOrFail($id);
            return response()->json(['appointment' => $appointment], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Appointment not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => "Internal Server Error Occurred: {$e}"], 500);
        }
    }

    
    public function update(Request $request, string $id)
    {
        return 'update';
    }

    
    public function destroy(string $id)
    {

        try {

            DB::beginTransaction();

            $appointment = Appointment::findOrFail($id);
            $property = Property::where('user_id', $appointment->user_id);

            $propertyStatusUpdated = $property->update([
                'status' => 'available',
                'user_id' => null
                
            ]);

            if($propertyStatusUpdated){
                $appointment->delete();

                DB::commit();
                return response()->json([
                    'message' => 'Appointment Deleted Successfully',
                    'appointment' => $appointment
                ]);
            }
        

        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json(['error' => 'Appointment not found'], 404);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => "Internal Server Error Occurred: {$e}"], 500);
        }
        
    }
}
