<?php

namespace App\Models\Orders;

use App\Models\Booking;
use App\Models\City;
use App\Models\Products\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingDetail extends Model
{
    use HasFactory;
    protected $table = 'booking_details';


    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }


    // public function product() //M:1
    // {
    //     return $this->belongsTo(Product::class, 'product_id');
    // }

    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }
}
