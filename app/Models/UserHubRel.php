<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserHubRel extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'hub_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hub()
    {
        return $this->belongsTo(Hub::class);
    }

}
