<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RepresentativeAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name'      => 'Joshua',
            'username'  => 'joshua123',
            'email'     => 'joshua@gmail.com',
            'password'  =>  Hash::make('joshua123'),
            'role'      => 'client_representative'
        ]);
    }
}
