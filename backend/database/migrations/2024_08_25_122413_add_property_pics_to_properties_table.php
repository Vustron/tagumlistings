<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPropertyPicsToPropertiesTable extends Migration
{
    public function up()
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->json('propertyPics')->nullable();
        });
    }

    public function down()
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn('propertyPics');
        });
    }
}
