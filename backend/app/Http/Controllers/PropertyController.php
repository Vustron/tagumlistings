<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function client(Request $request)
    {
        return 'client can access';
    }

    public function client_representative(Request $request)
    {
        return 'client_representative can access';
    }
}
