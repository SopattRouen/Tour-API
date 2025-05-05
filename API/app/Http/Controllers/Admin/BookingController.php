<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\MainController;
use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;

class BookingController extends MainController
{

    // public function index()
    // {
    //     // Load bookings with city and city's country and user
    //     $bookings = Booking::with(['city.country', 'user'])->orderBy('id', 'desc')->get();

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Bookings fetched successfully.',
    //         'data' => $bookings
    //     ], Response::HTTP_OK);
    // }

    public function index(Request $req){

        // Declar Variable
        $data = Booking::select('*')
        ->with(['bookings'])
        ;

        // ===>> Filter Data
        // By Key compared with Code or Name
        if ($req->key && $req->key != '') {

            $data = $data->where('name', 'LIKE', '%' . $req->key . '%')
            ->Orwhere('name', 'LIKE', '%' . $req->key . '%');
        }

        $data = $data->orderBy('id', 'desc') // Order Data by Giggest ID to small
        ->paginate($req->limit ? $req->limit :20,'per_page'); // Paginate Data

        // ===> Success Response Back to Client
        return response()->json($data, Response::HTTP_OK);

    }


    /**
     * Show a single booking by ID.
     */
    public function show($id)
    {
        $booking = Booking::with(['user', 'city'])->find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($booking, Response::HTTP_OK);
    }

    /**
     * Update a booking.
     */
    public function update(Request $request, $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'name'          => 'sometimes|required|string|max:150',
            'phone_number'  => 'sometimes|required|string|max:200',
            'num_of_guests' => 'sometimes|required|integer',
            'checkin_date'  => 'sometimes|required|date',
            'destination'   => 'sometimes|required|string|max:200',
            'status'        => 'sometimes|required|string|max:250',
            'user_id'       => 'sometimes|required|exists:user,id',
            'city_id'       => 'sometimes|required|exists:cities,id',
            'payment'       => 'sometimes|required|string|max:50',
        ]);

        $booking->update($validated);

        return response()->json(['message' => 'Booking updated successfully', 'data' => $booking], Response::HTTP_OK);
    }

    /**
     * Delete a booking.
     */
    public function destroy($id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], Response::HTTP_NOT_FOUND);
        }

        $booking->delete();

        return response()->json(['message' => 'Booking deleted successfully'], Response::HTTP_OK);
    }
}
