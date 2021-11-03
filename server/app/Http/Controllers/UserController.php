<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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
}
