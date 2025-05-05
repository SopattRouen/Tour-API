<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User\User;
use App\Models\City;
use App\Models\Orders\BookingDetail;

class Booking extends Model
{
    use HasFactory;

    protected $table = 'bookings';

    protected $fillable = [
        'name',
        'phone_number',
        'num_of_guests',
        'checkin_date',
        'destination',
        'status',
        'user_id',
        'city_id',
        'payment',
    ];

    // Relationship: Booking belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relationship: Booking belongs to a city (main destination)
    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    // Relationship: A booking can have many booking details (e.g., cities visited or itinerary)
    public function details()
    {
        return $this->hasMany(BookingDetail::class, 'booking_id')
                    ->with('city:id,name,image');
    }
}
