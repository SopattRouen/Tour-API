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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id(); // BIGINT UNSIGNED
            $table->string('name', 150);
            $table->string('phone_number', 200);
            $table->integer('num_of_guests');
            $table->timestamp('checkin_date', 6);
            $table->string('destination', 200);
            $table->string('status', 250);
            $table->unsignedBigInteger('user_id'); // Must match user.id
            $table->unsignedBigInteger('city_id');
            $table->string('payment', 50);
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));

            $table->foreign('user_id')
                  ->references('id')
                  ->on('user')
                  ->onDelete('cascade');

            $table->foreign('city_id')
                  ->references('id')
                  ->on('cities')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
