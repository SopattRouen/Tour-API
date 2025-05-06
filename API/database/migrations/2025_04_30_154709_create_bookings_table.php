<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
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
        $table->integer('receipt_number')->unsigned()->nullable();
        $table->string('name', 150);
        $table->string('phone_number', 200);
        $table->unsignedInteger('num_of_guests');
        $table->timestamp('checkin_date');
        $table->string('destination', 200);
        $table->string('status', 250);
        $table->foreignId('user_id')->constrained('user')->onDelete('cascade');
        $table->foreignId('city_id')->constrained('cities')->onDelete('cascade');
        $table->string('payment', 50);
        $table->dateTime('booked_at')->nullable();

        $table->timestamps();
        $table->softDeletes();
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
