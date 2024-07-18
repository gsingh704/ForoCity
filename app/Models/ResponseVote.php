<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResponseVote extends Model
{
    use HasFactory;

    public function response()
    {
        return $this->belongsTo(Response::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
