<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('booking_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('booking_id'); // FK to bookings
            $table->unsignedBigInteger('city_id');    // FK to cities
            $table->integer('trip_days');             // Customizable trip days for the booking
            $table->decimal('price', 10, 2);          // Booking price for the city
            $table->integer('num_of_guests');



            // Foreign keys
            $table->foreign('booking_id')
                  ->references('id')
                  ->on('bookings')
                  ->onDelete('cascade');

            $table->foreign('city_id')
                  ->references('id')
                  ->on('cities')
                  ->onDelete('cascade');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_details');
    }
};

