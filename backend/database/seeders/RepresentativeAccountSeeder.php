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
            'name'              => 'Joshua',
            'address'           => 'Barangay Gredu Panabo City',
            'contact_number'    => '+63-987-685-4678',
            'email'             => 'joshua@gmail.com',
            'password'          =>  Hash::make('joshua123'),
            'role'              => 'company_representative'
        ]);
    }
}
