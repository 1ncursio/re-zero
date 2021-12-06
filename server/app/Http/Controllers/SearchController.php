<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class SearchController extends BaseController
{
    public function query(Request $request)
    {
        // Get the query string from the request
        error_log($request->q);
        error_log($request->has('q'));
        // $post = $request->has('q') ? Post::search($request->q)->latest()->paginate(12) : Post::latest()->paginate(12);
        $post = $request->has('q') ? Post::search($request->q)->paginate(12) : Post::latest()->paginate(12);
        // paginate after search



        return $this->sendResponse($post, 'Posts retrieved successfully.');
    }
}
