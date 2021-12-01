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

    public function toggleLike(Post $post, Comment $comment)
    {
        $comment->likes()->toggle(auth()->id());

        return $this->sendResponse($comment, 'Comment liked(unliked) successfully.');
    }

    // store reply
    public function storeReply(Request $request, Post $post, Comment $comment)
    {
        // store a reply after validating request data
        $this->validate($request, [
            'content' => 'required|string|max:200',
        ]);

        $reply = Comment::create([
            'content' => $request->content,
            'post_id' => $post->id,
            'user_id' => auth()->id(),
            'reply_id' => $comment->id,
        ]);

        return $this->sendResponse($reply, 'Reply created successfully.');
    }

    // update reply
    public function updateReply(Request $request, Post $post, Comment $comment, Comment $reply)
    {
        // update a reply after validating request data
        $this->validate($request, [
            'content' => 'required|string|max:200',
        ]);

        $reply->update($request->only(['content']));

        return $this->sendResponse($reply, 'Reply updated successfully.');
    }

    // delete reply
    public function destroyReply(Post $post, Comment $comment, Comment $reply)
    {
        $reply->delete();

        return $this->sendResponse($reply, 'Reply deleted successfully.');
    }
}
