<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Post extends Model
{
    use HasFactory, Searchable;

    protected $with = ['user', 'likes'];
    protected $fillable = ['title', 'content', 'user_id'];

    public function searchableAs()
    {
        return 'posts';
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // return users like this post
    public function likes()
    {
        return $this->belongsToMany(User::class, 'post_like');
    }
}
