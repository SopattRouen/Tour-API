<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\City;
use App\Models\User\User;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cities = City::all();
        $users = User::all();

        if ($cities->isEmpty()) {
            $this->command->warn('No cities found. Please seed the cities table first.');
            return;
        }

        for ($i = 1; $i <= 5; $i++) {
            $city = $cities->random(); // pick one city
            $user = $users->random(); // get a random user instance

            DB::table('bookings')->insert([
                'name'           => $user->name,
                'phone_number'   => '01234567' . $i,
                'num_of_guests'  => rand(1, 5),
                'checkin_date'   => Carbon::now()->addDays(rand(1, 30)),
                'destination'    => $city->name,     // destination = city name
                'status'         => 'paid',
                'user_id'        => 1,               // make sure this user exists
                'city_id'        => $city->id,       // consistent city_id
                'payment'        => 'cash',
                'created_at'     => now(),
            ]);
        }
    }
}
