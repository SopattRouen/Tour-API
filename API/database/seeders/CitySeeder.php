<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CitySeeder extends Seeder
{
    public function run()
    {
        /*
        |--------------------------------------------------------------------------
        | Create Sample Cities
        |--------------------------------------------------------------------------
        */
        $cities = [
            [
                'name' => 'Paris',
                'image' => 'static/City/Cities/download.jpg',
                'trip_days' => 5,
                'price' => '800',
                'country_id' => 1,
                'created_at' => Carbon::now(),
            ],
            [
                'name' => 'Tokyo',
                'image' => 'static/City/Cities/download-1.jpg',
                'trip_days' => 7,
                'price' => '1200',
                'country_id' => 2,
                'created_at' => Carbon::now(),
            ],
            [
                'name' => 'Osaka',
                'image' => 'static/City/Cities/download-9.jpg',
                'trip_days' => 7,
                'price' => '780',
                'country_id' => 2,
                'created_at' => Carbon::now(),
            ],
            [
                'name' => 'Fukuoka',
                'image' => 'static/City/Cities/download-10.jpg',
                'trip_days' => 7,
                'price' => '780',
                'country_id' => 2,
                'created_at' => Carbon::now(),
            ],
            [
                'name' => 'Nishio',
                'image' => 'static/City/Cities/download-11.jpg',
                'trip_days' => 7,
                'price' => '780',
                'country_id' => 2,
                'created_at' => Carbon::now(),
            ],
            [
                'name' => 'Siem Reab',
                'image' => 'static/City/Cities/download-6.jpg',
                'trip_days' => 7,
                'price' => '500',
                'country_id' => 3,
                'created_at' => Carbon::now(),
            ],
            [
                'name' => 'Bankok',
                'image' => 'static/City/Cities/download-8.jpg',
                'trip_days' => 15,
                'price' => '1500',
                'country_id' => 4,
                'created_at' => Carbon::now(),
            ],
            [
                'name' => 'Vieng Chan',
                'image' => 'static/City/Cities/download-7.jpg',
                'trip_days' => 7,
                'price' => '450',
                'country_id' => 5,
                'created_at' => Carbon::now(),
            ],
            [
                'name' => 'Phatya',
                'image' => 'static/City/Cities/download-8.jpg',
                'trip_days' => 15,
                'price' => '1500',
                'country_id' => 4,
                'created_at' => Carbon::now(),
            ],
            [
                'name' => 'Vieng Chan',
                'image' => 'static/City/Cities/download-7.jpg',
                'trip_days' => 7,
                'price' => '450',
                'country_id' => 5,
                'created_at' => Carbon::now(),
            ],
            [
                'name' => 'Phatya',
                'image' => 'static/City/Cities/download-8.jpg',
                'trip_days' => 15,
                'price' => '1500',
                'country_id' => 4,
                'created_at' => Carbon::now(),
            ],
            [
                'name' => 'Vieng Chan',
                'image' => 'static/City/Cities/download-7.jpg',
                'trip_days' => 7,
                'price' => '450',
                'country_id' => 5,
                'created_at' => Carbon::now(),
            ],
        ];

        DB::table('cities')->insert($cities);
    }
}