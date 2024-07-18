<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Response extends Model
{
    use HasFactory;

    protected $fillable = [
        'content',
        'user_id',
        'post_id',
        'parent_id',
    ];

    protected $appends = [
        'votes_count',
        'created_format',
        'user_vote',
        // 'hub_name',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // public function post()
    // {
    //     return $this->belongsTo(Post::class);
    // }

    public function votes()
    {
        return $this->hasMany(ResponseVote::class);
    }

    public function getVotesCountAttribute()
    {
        return $this->votes()->count();
    }

    public function getCreatedFormatAttribute()
    {
        return $this->created_at->diffForHumans();
    }

    public function getUserVoteAttribute()
    {
        if (auth()->user()) {
            return $this->votes()->where('user_id', auth()->user()->id)->first();
        }
        return null;
    }

    // //Hub name  of the Response
    // public function getHubNameAttribute()
    // {
    //     return $this->post->hub->name;
    // }

}
