<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Payment extends Model
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'amount',
        'mode_of_payment',
        'user_id',
        'property_id'
    ];

    protected $table = 'payment';
}
