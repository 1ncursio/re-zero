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

        // $comments = Cache::has($key) ? Cache::get($key) : Cache::remember(
        //     $key,
        //     $ttl,
        //     fn () =>
        //     $post->comments()->latest()->paginate(12)
        // );

        $comments = $post->comments()->oldest()->paginate(12);

        return $this->sendResponse($comments, 'Comments retrieved successfully.');
    }



    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Post $post)
    {
        // store a comment after validating request data
        $this->validate($request, [
            'content' => 'required|string|max:200',
        ]);

        $comment = Comment::create([
            'content' => $request->content,
            'post_id' => $post->id,
            'user_id' => auth()->id(),
        ]);


        // clear cache
        // $key = "posts/{$comment->post_id}/comments";
        // Cache::forget($key);

        return $this->sendResponse($comment, 'Comment created successfully.');
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
        // update a comment after validating request data
        $this->validate($request, [
            'content' => 'required|string|max:200',
        ]);

        $comment->update($request->only(['content']));

        return $this->sendResponse($comment, 'Comment updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Comment $comment)
    {

        $comment->delete();

        return $this->sendResponse($comment, 'Comment deleted successfully.');
    }

    public function like(Comment $comment)
    {
        $comment->likes()->create([
            'user_id' => auth()->id(),
        ]);

        return $this->sendResponse($comment, 'Comment liked successfully.');
    }

    public function unlike(Comment $comment)
    {
        $comment->likes()->where('user_id', auth()->id())->delete();

        return $this->sendResponse($comment, 'Comment unliked successfully.');
    }
}
