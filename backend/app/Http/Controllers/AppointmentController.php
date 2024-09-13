<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Property;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AppointmentController extends Controller
{

    // Client API Methods
    public function requestAppointment(Request $request)
    {
        try {

            $data = $request->validate([
                'appointment_date' => 'required',
                'property_id' => 'required',
            ]);

            Appointment::create([
                'appointment_date' => $data['appointment_date'],
                'user_id' => Auth::id(),
                'property_id' => $data['property_id'],
            ]);

            return response()->json(['message' => 'Appointment Request Sent!'], 201);

        } catch (\Exception $e) {

            Log::error('Appointment Request Failed:' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'message' => 'Setting Appointments Error',
                'error' => $e->getMessage(),
            ], $e->getCode());
        }

    }
    
    // Company Representative API Methods

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
                            'properties.location',
                            'appointments.status'
                        )
                        ->paginate(10);

            return response()->json($appointments, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Getting Appointments Error',
                'error' => $e->getMessage(),
            ], $e->getCode());
        }
      
    }

    

    public function confirmAppointmentRequest(Request $request, string $appointment_id)
    {
        try {

            $data = $request->validate([
                'status' => 'required|string'
            ]);

            $appointment = Appointment::findOrFail($appointment_id);
            $appointment->fill($data);

            $appointment->save();

            return response()->json([
                'message' => 'Appointment Confirmed Successfully',
                'appointment' => $appointment,
            ], 200);
        
        } catch (\Exception $e) {

            Log::error('Confirming Appointment Request Failed:' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'message' => 'Confirming Appointments Error',
                'error' => $e->getMessage(),
            ], $e->getCode());
        }
        
    }

    
    public function show(string $id)
    {

        try {

            $appointment = Appointment::findOrFail($id);
            return response()->json(['appointment' => $appointment], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Appointment not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => "Internal Server Error Occurred: {$e}"], $e->getCode());
        }
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
