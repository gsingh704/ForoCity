<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;


    protected $fillable = ['sender_id', 'receiver_id', 'content'];

    protected $appends = ['receiver_name', 'sender_name', 'created_at_human'];

    public function getReceiverNameAttribute()
    {
        return User::find($this->receiver_id)->name;
    }

    public function getSenderNameAttribute()
    {
        return User::find($this->sender_id)->name;
    }

    public function getCreatedAtHumanAttribute()
    {
        return $this->created_at->diffForHumans();
    }
}