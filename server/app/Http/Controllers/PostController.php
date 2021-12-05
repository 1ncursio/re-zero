<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Cache;
use Illuminate\Http\Request;

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
        $key = "posts";
        $ttl = now()->addMinutes(5);

        $posts = Post::latest()->paginate(12);

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
}
