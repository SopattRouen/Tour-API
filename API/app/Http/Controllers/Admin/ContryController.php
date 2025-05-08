<?php

namespace App\Http\Controllers\Admin;


use App\Http\Controllers\MainController;
use App\Models\Country;
use App\Services\FileUpload;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ContryController extends MainController
{
    //
    public function listing(Request $req)
    {
        // Base query
        $data = Country::select('*');

        // ===>> Filter Data
        // Filter by name or continent using a search key
        if ($req->key && $req->key != '') {
            $data = $data->where(function ($query) use ($req) {
                $query->where('name', 'LIKE', '%' . $req->key . '%')
                    ->orWhere('continent', 'LIKE', '%' . $req->key . '%');
            });
        }

        // Optional: Add more filters here if needed, such as by population, etc.

        // Order by latest and paginate
        $data = $data->orderBy('id', 'desc')
                    ->paginate($req->limit ?? 10, ['*'], 'per_page');

        // Return response
        return response()->json($data, Response::HTTP_OK);
    }

    public function view($id = 0){

        // Find record from DB
        $data = Country::select('*')->find($id);

        // ===>> Check if data is valide
        if ($data) { // Yes

            // ===> Success Response Back to Client
            return response()->json($data, Response::HTTP_OK);

        } else { // No

            // ===> Failed Response Back to Client
            return response()->json([
                'status'    => 'បរាជ័យ',
                'message'   => 'ទិន្នន័យមិនត្រឹមត្រូវ',
            ], Response::HTTP_BAD_REQUEST);

        }

    }


    public function create(Request $req)
    {
        // Check validation
        $this->validate(
            $req,
            [
                'name'              => 'required|max:50',
                'continent'              => 'required|max:20',
                'population'        => 'required|max:100',
                'territory'           => 'required|max:100',
                'description'           => 'required|max:10000',
            ],
            [
                'name.required'         => 'សូមបញ្ចូលឈ្មោះផលិតផល',
                'name.max'              => 'ឈ្មោះផលិតផលមិនអាចលើសពី50ខ្ទង់',

                'continent.required'         => 'សូមបញ្ចូលឈ្មោះទ្វីបផលិតផល',
                'continent.max'              => 'សូមបញ្ចូលឈ្មោះទ្វីបមិនអាចលើសពី២០ខ្ទង់',

                'population.required'   => 'សូមបញ្ចូលប្រជាជន',
                'population.max'        => 'សូមបញ្ចូលប្រជាជនមិនអោយលើសពី១០០ខ្ទង់',

                'territory.required'   => 'សូមបញ្ចូលផ្ទៃដី',
                'territory.max'        => 'សូមបញ្ចូលផ្ទៃដីមិនអោយលើសពី១០០ខ្ទង់',

                'description.required'   => 'សូមបញ្ចូលការបរិយាយ',
                'description.max'        => 'សូមបញ្ចូលការបរិយាយមិនអោយលើសពី១០០ខ្ទង់',

            ]

        );
        $contry                = new Country;
        $contry->name          = $req->name;
        $contry->continent          = $req->continent;
        $contry->population       = $req->population;
        $contry->territory    = $req->territory;
        $contry->description    = $req->description;

        //Save the data to DB
        $contry->save();

        //  Upload image
        if ($req->image) {

            // Crate folder for image and then stored the image in the folder
            $folder = Carbon::today()->format('d-m-y');
            $image  = FileUpload::uploadFile($req->image, 'contries/' . $folder, $req->fileName);

            // Save image
            $contry->image  = $image['url'];
            $contry->save();
        }

        // send response back to clients as json
        return response()->json([
            'data'      => Country::select('*')->find($contry->id),
            'message'   => 'ប្រទេសត្រូវបានបង្កើតដោយជោគជ័យ។'
        ], Response::HTTP_OK);
    }

    public function update(Request $req, $id = 0)
    {
        // ===>> Check validation
        $this->validate(
            $req,
            [
                'name'              => 'required|max:50',
                'continent'         => 'required|max:20',
                'population'        => 'required|max:100',
                'territory'         => 'required|max:100',
                'description'       => 'required|max:10000',
            ],
            [
                'name.required'         => 'សូមបញ្ចូលឈ្មោះផលិតផល',
                'name.max'              => 'ឈ្មោះផលិតផលមិនអាចលើសពី50ខ្ទង់',

                'continent.required'    => 'សូមបញ្ចូលឈ្មោះទ្វីបផលិតផល',
                'continent.max'         => 'សូមបញ្ចូលឈ្មោះទ្វីបមិនអាចលើសពី២០ខ្ទង់',

                'population.required'   => 'សូមបញ្ចូលប្រជាជន',
                'population.max'        => 'សូមបញ្ចូលប្រជាជនមិនអោយលើសពី១០០ខ្ទង់',

                'territory.required'    => 'សូមបញ្ចូលផ្ទៃដី',
                'territory.max'         => 'សូមបញ្ចូលផ្ទៃដីមិនអោយលើសពី១០០ខ្ទង់',

                'description.required'  => 'សូមបញ្ចូលការបរិយាយ',
                'description.max'       => 'សូមបញ្ចូលការបរិយាយមិនអោយលើសពី១០០០០ខ្ទង់',
            ]
        );

        // ===>> Find record from DB
        $country = Country::find($id);

        // ===>> Check if record exists
        if ($country) {

            // Update fields
            $country->name        = $req->name;
            $country->continent   = $req->continent;
            $country->population  = $req->population;
            $country->territory   = $req->territory;
            $country->description = $req->description;

            // Save updated data
            $country->save();

            // ===>> Image Upload
            if ($req->image) {
                $folder = Carbon::today()->format('d-m-y');
                $image  = FileUpload::uploadFile($req->image, 'contries/' . $folder, $req->fileName);

                if ($image['url']) {
                    $country->image = $image['url'];
                    $country->save();
                }
            }

            // Return updated country data
            return response()->json([
                'status'    => 'ជោគជ័យ',
                'message'   => 'ទិន្នន័យត្រូវបានកែប្រែដោយជោគជ័យ',
                'data'      => Country::select('*')->find($country->id),
            ], Response::HTTP_OK);

        } else {
            return response()->json([
                'status'    => 'បរាជ័យ',
                'message'   => 'រកមិនឃើញទិន្នន័យ',
            ], Response::HTTP_NOT_FOUND);
        }
    }

    public function delete($id = 0){

        // Find record from DB
        $data = Country::find($id);

        // ===>> Check if data is valide
        if ($data) { // Yes

            // ===>> Delete Data from DB
            $data->delete();

            // ===> Success Response Back to Client
            return response()->json([
                'status'    => 'ជោគជ័យ',
                'message'   => 'ទិន្នន័យត្រូវបានលុប',
            ], Response::HTTP_OK);

        } else { // No

            // ===> Failed Response Back to Client
            return response()->json([
                'status'    => 'បរាជ័យ',
                'message'   => 'ទិន្នន័យមិនត្រឹមត្រូវ',
            ], Response::HTTP_BAD_REQUEST);

        }
    }
}
