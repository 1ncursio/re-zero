<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;
use Validator;

class UserController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function user(Request $request)
    {
        $payload = $request->user();
        return $this->sendResponse($payload, 'ok');
    }

    // updateProfile
    public function updateProfile(Request $request)
    {
        // validate
        $validator = Validator::make($request->all(), [
            'name' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $user = $request->user();
        $user->name = $request->name;
        $user->save();

        return $this->sendResponse($user, 'Profile updated successfully.');
    }


    // updateImage
    public function updateImage(Request $request)
    {
        // validate
        $this->validate($request, [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        error_log('updateImage1');

        $user = $request->user();
        $image = $request->file('image');
        $time = time();

        $filename = "{$time}_{$image->getClientOriginalName()}";
        $location = public_path('storage/images/' . $filename);
        Image::make($image)->resize(512, null, function ($constraint) {
            $constraint->aspectRatio();
        })->save($location);

        $user->image_url = $filename;
        $user->save();

        return $this->sendResponse($filename, 'Image updated successfully.');
    }
}
