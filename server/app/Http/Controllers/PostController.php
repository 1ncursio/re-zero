<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Cache;
use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;

class PostController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // paginate comments using cache
        // $key = "posts";
        // $ttl = now()->addMinutes(5);

        $posts = Post::latest()->paginate(12);
        // get clients ip address for cache

        // $posts = Cache::has($key) ? Cache::get($key) : Cache::remember(
        //     $key,
        //     $ttl,
        //     fn () =>
        //     Post::latest()->paginate(12)
        // );

        return $this->sendResponse($posts, 'Posts retrieved successfully.');
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // store a post after validating request data
        $this->validate($request, [
            'title' => 'required|string|max:50',
            'content' => 'required|string',
        ]);

        $post = Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => auth()->id(),
        ]);

        return $this->sendResponse($post, 'Post created successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function show(Post $post)
    {
        // parse the cookie and get the views count from it
        $post_views_cookie = request()->cookie('post_views');
        $post_views = explode('|', $post_views_cookie);

        if (!in_array($post->id, $post_views)) {

            $post->increment('views');
            $cookie = cookie('post_views', "{$post_views_cookie}|{$post->id}", 60);
            return $this->sendResponse($post, 'Post retrieved successfully.')->withCookie($cookie);
        }

        return $this->sendResponse($post, 'Post retrieved successfully.');
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Post $post)
    {
        // update a post after validating request data
        $this->validate($request, [
            'title' => 'required|string|max:50',
            'content' => 'required|string',
        ]);

        $post->update([
            'title' => $request->title,
            'content' => $request->content
        ]);

        return $this->sendResponse($post, 'Post updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function destroy(Post $post)
    {
        // delete a post
        $post->delete();

        return $this->sendResponse($post, 'Post deleted successfully.');
    }

    public function toggleLike(Post $post)
    {
        // toggle like a post
        $post->likes()->toggle(auth()->id());

        return $this->sendResponse($post, 'Post liked(unliked) successfully.');
    }

    public function uploadImage(Request $request)
    {
        // upload an image
        $this->validate($request, [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $image = $request->file('image');
        $time = time();

        $filename = "{$time}_{$image->getClientOriginalName()}";
        $location = public_path('storage/images/' . $filename);
        Image::make($image)->resize(768, null, function ($constraint) {
            $constraint->aspectRatio();
        })->save($location);


        // http://localhost:8000/storage/images/1638867234.jpg

        return $this->sendResponse($filename, 'Image uploaded successfully.');
    }
}
