<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Property extends Model
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        "category",
        "location",
        "status",
        "user_id",
        "appointment_id",
    ];

    
}
