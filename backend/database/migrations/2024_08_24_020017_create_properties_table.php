<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->json('propertyPics')->nullable();
            $table->string('property_name');
            $table->string('description');
            $table->string('category');
            $table->string('location');
            $table->string('status')->default('available');
            $table->decimal('price', 10, 2);
            $table->decimal('reservation_fee', 10, 2);
            $table->timestamps();
            $table->foreignId('user_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
