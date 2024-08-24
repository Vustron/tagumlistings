<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Appointment extends Model
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'user_id',
        'property_id',
        'appointment_date'
    ];
}
