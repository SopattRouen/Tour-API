<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BookingSeeder extends Seeder
{
    public function run()
    {
        /*
        |--------------------------------------------------------------------------
        | Create Sample Bookings
        |--------------------------------------------------------------------------
        */
        $bookings = [
            [
                'name' => 'John Doe',
                'phone_number' => '+33612345678',
                'num_of_guests' => 2,
                'checkin_date' => Carbon::now()->addDays(10),
                'destination' => 'Paris',
                'status' => 'confirmed',
                'city_id' => 1,
                'user_id' => 2,
                'payment' => 'credit_card',
                'created_at' => Carbon::now(),
            ],
            [
                'name' => 'Jane Smith',
                'phone_number' => '+819012345678',
                'num_of_guests' => 1,
                'checkin_date' => Carbon::now()->addDays(14),
                'destination' => 'Tokyo',
                'status' => 'pending',
                'city_id' => 2,
                'user_id' => 2,
                'payment' => 'paypal',
                'created_at' => Carbon::now(),
            ],
        ];

        DB::table('bookings')->insert($bookings);
    }
}