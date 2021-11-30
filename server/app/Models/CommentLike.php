<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CommentLike extends Pivot
{
    protected $table = 'comment_likes';
    protected $fillable = ['user_id', 'comment_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comment()
    {
        return $this->belongsTo(Comment::class);
    }
}
