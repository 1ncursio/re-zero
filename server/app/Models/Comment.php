<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $with = ['user', 'likes'];
    protected $fillable = ['content', 'post_id', 'user_id', 'reply_id'];
    protected $appends = ['reply_count'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    // return users like this comment
    public function likes()
    {
        return $this->belongsToMany(User::class, 'comment_like');
    }

    // replies
    public function replies()
    {
        return $this->hasMany(Comment::class, 'reply_id');
    }

    // has reply
    public function hasReplies()
    {
        return $this->replies()->exists();
    }

    // reply count
    public function getReplyCountAttribute()
    {
        return $this->replies()->count();
    }
}
