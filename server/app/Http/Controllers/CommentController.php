<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Cache;
use Illuminate\Http\Request;

class CommentController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Post $post)
    {
        // paginate comments using cache
        $key = "posts/{$post->id}/comments";
        $ttl = now()->addMinutes(5);

        $comments = Cache::has($key) ? Cache::get($key) : Cache::remember(
            $key,
            $ttl,
            fn () =>
            $post->comments()->latest()->paginate(10)
        );

        return $this->sendResponse($comments, 'Comments retrieved successfully.');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // store a comment after validating request data
        $this->validate($request, [
            'body' => 'required|string|max:255',
        ]);

        $comment = Comment::create([
            'body' => $request->body,
            'post_id' => $request->post_id,
            'user_id' => $request->user_id,
        ]);


        // clear cache
        $key = "posts/{$comment->post_id}/comments";
        Cache::forget($key);

        return $this->sendResponse($comment, 'Comment created successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function show(Comment $comment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Comment $comment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Comment $comment)
    {
        //
    }
}
