<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\MainController;
use App\Models\Booking;
use App\Models\BookingDetail;
use App\Models\City;
use App\Models\User\User;
use App\Services\TelegramService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;

class BookingController extends MainController
{
    public function makeBooking(Request $req)
    {
        // ===>> Validate Request
        $this->validate($req, [
            'phone_number'   => 'required|string|max:20',
            'num_of_guests'  => 'required|integer|min:1',
            'checkin_date'   => 'required|date',
            'city_id'        => 'required|exists:cities,id'
        ]);

        // ===>> Authenticated user
        $user = JWTAuth::parseToken()->authenticate();

        // ===>> Find city
        $city = City::find($req->city_id);

        // ===>> Create Booking
        $booking = new Booking;
        $booking->receipt_number  = $this->_generateReceiptNumber();
        $booking->name            = $req->name;
        $booking->phone_number    = $req->phone_number;
        $booking->num_of_guests   = $req->num_of_guests;
        $booking->checkin_date    = $req->checkin_date;
        $booking->destination     = $city->name;
        $booking->city_id         = $city->id;
        $booking->user_id         = $user->id;
        $booking->status          = 'paid';
        $booking->payment         = 'credit card';
        $booking->booked_at       = Carbon::now();
        $booking->save();

        // ===>> Create Booking Detail
        $bookingDetail = new BookingDetail;
        $bookingDetail->booking_id    = $booking->id;
        $bookingDetail->city_id       = $city->id;
        $bookingDetail->trip_days     = $city->trip_days;
        $bookingDetail->price         = $city->price;
        $bookingDetail->num_of_guests = $req->num_of_guests;
        $bookingDetail->save();

        // ===> Get Data for Client Response to view the booking in Popup.
        $bookingData = Booking::select('*')
            ->with([
                'user:id,name', // M:1 (booking -> user)
                'city:id,name', // M:1 (booking -> city)
                'details:id,booking_id,city_id,trip_days,price,num_of_guests', // 1:M (booking -> booking_details)
                'details.city:id,name' // M:1 (booking_details -> city)
            ])
            ->find($booking->id);

        // ===>> Send Telegram Notification
        $this->_sendNotification($bookingData);

        return response()->json([
            'booking'  => $bookingData,
            'message'  => 'ការកក់បានជោគជ័យ។'
        ], Response::HTTP_OK);
    }
    public function listBookings(Request $request)
    {
        // Get pagination parameters from request with defaults
        $page = $request->input('page', 1);
        $limit = $request->input('limit', 10);
        
        // Validate pagination parameters
        if (!is_numeric($page) || $page < 1) {
            $page = 1;
        }
        
        if (!is_numeric($limit) || $limit < 1) {
            $limit = 10;
        }
    
        // Base query
        $query = Booking::with([
                'user:id,name',
                'city:id,name',
                'details:id,booking_id,trip_days,price,num_of_guests'
            ])
            ->select([
                'id',
                'receipt_number',
                'phone_number',
                'num_of_guests',
                'user_id',
                'city_id',
                'booked_at'
            ])
            ->orderBy('booked_at', 'desc');
    
        // Get total count before pagination
        $total = $query->count();
    
        // Apply pagination
        $bookings = $query->paginate($limit, ['*'], 'page', $page);
    
        // Transform the results
        $transformedBookings = $bookings->map(function ($booking) {
            $detail = $booking->details->first();
            
            return [
                'receipt_number' => $booking->receipt_number,
                'city_name' => $booking->city->name ?? null,
                'user_name' => $booking->user->name ?? null,
                'trip_days' => $detail->trip_days ?? null,
                'price' => $detail->price ?? null,
                'phone_number' => $booking->phone_number,
                'num_of_guests' => $detail->num_of_guests ?? $booking->num_of_guests,
                'checkin_date' => $booking->booked_at // Assuming booked_at is the check-in date
            ];
        });
    
        return response()->json([
            'data' => $transformedBookings,
            'total' => $total,
            'current_page' => $bookings->currentPage(),
            'per_page' => $bookings->perPage(),
            'last_page' => $bookings->lastPage(),
            'message' => 'Booking list retrieved successfully'
        ], Response::HTTP_OK);
    }
    private function _generateReceiptNumber()
    {
        do {
            $number = rand(1000000, 9999999);
            $exists = Booking::where('receipt_number', $number)->exists();
        } while ($exists);

        return $number;
    }

    private function _sendNotification($booking)
    {
        $htmlMessage  = "<b>ការកក់បានជោគជ័យ!</b>\n";
        $htmlMessage .= "- លេខបង្កាន់ដៃ៖ {$booking->receipt_number}\n";
        $htmlMessage .= "- អ្នកកក់៖ {$booking->name}\n";
        $htmlMessage .= "- ទូរស័ព្ទ៖ {$booking->phone_number}\n";
        $htmlMessage .= "- ទីកន្លែង៖ {$booking->destination}\n";
        $htmlMessage .= "- ចំនួនអ្នក៖ {$booking->num_of_guests}\n";
        $htmlMessage .= "- ថ្ងៃចូលស្នាក់៖ {$booking->checkin_date}\n";
        $htmlMessage .= "- កាលបរិច្ឆេទកក់៖ {$booking->booked_at}";

        TelegramService::sendMessage($htmlMessage, env('TELEGRAM_CHAT_ID'));
    }
}
