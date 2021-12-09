<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    use HasFactory;

    protected $fillable = [
        'black_id',
        'white_id',
        'status',
        'record',
        'play_time',
    ];

    public function black()
    {
        return $this->belongsTo(User::class, 'black_id', 'id');
    }

    public function white()
    {
        return $this->belongsTo(User::class, 'white_id', 'id');
    }
}
