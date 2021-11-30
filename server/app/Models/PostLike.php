<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PostLike extends Pivot
{
    protected $table = 'post_like';
    protected $fillable = ['user_id', 'post_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
