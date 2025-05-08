<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\City;
use App\Models\User\User;
use App\Models\Booking;
use App\Models\BookingDetail;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ============ Required Data ============ \\
        $cities = City::all();
        $users = User::all();

        if ($cities->isEmpty()) {
            $this->command->warn('No cities found. Please seed the cities table first.');
            return;
        }

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please seed the users table first.');
            return;
        }

        // ============ Generate Booking Data ============ \\
        for ($i = 1; $i <= 100; $i++) {
            $city = $cities->random();
            $user = $users->random();
            $bookedAt = Carbon::now()->subDays(rand(0, 30))->setTime(rand(0, 23), rand(0, 59));

            // Create Booking
            $booking = Booking::create([
                'receipt_number' => $this->generateReceiptNumber(),
                'name' => $user->name,
                'phone_number' => '0123456' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'num_of_guests' => rand(1, 5),
                'checkin_date' => Carbon::now()->addDays(rand(1, 30)),
                'destination' => $city->name,
                'status' => $this->randomStatus(),
                'user_id' => $user->id,
                'city_id' => $city->id,
                'payment' => 'credit card',
                'booked_at' => $bookedAt,
                'created_at' => $bookedAt,
                'updated_at' => $bookedAt,
            ]);

            // Create Booking Detail
            BookingDetail::create([
                'booking_id' => $booking->id,
                'city_id' => $city->id,
                'trip_days' => $city->trip_days,
                'price' => $city->price,
                'num_of_guests' => $booking->num_of_guests,
                'created_at' => $bookedAt,
                'updated_at' => $bookedAt,
            ]);
        }
    }

    /**
     * Generate a unique receipt number.
     */
    private function generateReceiptNumber(): string
    {
        do {
            $number = rand(100000, 999999);
            $exists = DB::table('bookings')->where('receipt_number', $number)->exists();
        } while ($exists);

        return (string) $number;
    }

    /**
     * Randomly return a status.
     */
    private function randomStatus(): string
    {
        $statuses = ['paid'];
        return $statuses[array_rand($statuses)];
    }
}