<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CountrySeeder extends Seeder
{
    public function run()
    {
        /*
        |--------------------------------------------------------------------------
        | Create Sample Countries
        |--------------------------------------------------------------------------
        */
       // database/seeders/CountrySeeder.php

        $countries = [
            [
                'name' => 'France',
                'image' => 'static/Contry/Contry/download-2.jpg',
                'continent' => 'Europe',
                'population' => '67 million',
                'territory' => '551,695 km²',
                'description' => 'France is known for its art, fashion, and gastronomy.',
                'created_at' => Carbon::now(),
            ],
            [
                'name' => 'Japan',
                'image' => 'static/Contry/Contry/download-3.jpg',
                'continent' => 'Asia',
                'population' => '125 million',
                'territory' => '377,975 km²',
                'description' => 'Japan is known for its technology and culture.',
                'created_at' => Carbon::now(),
            ],
            [
                'name' => 'Cambodia',
                'image' => 'static/Contry/Contry/download-4.jpg',
                'continent' => 'Asia',
                'population' => '17 million',
                'territory' => '181,035 km²',
                'description' => 'Cambodia is known for its technology and culture.',
                'created_at' => Carbon::now(),
            ],
            [
                'name' => 'Thailand',
                'image' => 'static/Contry/Contry/download-5.jpg',
                'continent' => 'Asia',
                'population' => '71.7 million',
                'territory' => ' 255,559 km²',
                'description' => 'Thailand is known for its technology and culture.',
                'created_at' => Carbon::now(),
            ],
            [
                'name' => 'Lao',
                'image' => 'static/Contry/Contry/images.jpg',
                'continent' => 'Asia',
                'population' => '7.665 million',
                'territory' => ' 230,800 km²',
                'description' => 'Lao is known for its technology and culture.',
                'created_at' => Carbon::now(),
            ],


        ];

        DB::table('countries')->insert($countries);
    }
}