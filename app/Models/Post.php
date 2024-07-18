<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Post extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $fillable = [
        'title',
        'content',
        'user_id',
        'hub_id',
    ];

    protected $appends = [
        'image_url',
        'votes_count',
        'responses_count',
        'created_format',
        'user_vote',
        'tags',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hub()
    {
        return $this->belongsTo(Hub::class);
    }

    public function votes()
    {
        return $this->hasMany(PostVote::class);
    }

    public function responses()
    {
        return $this->hasMany(Response::class);
    }

    public function tags()
    {
        return $this->hasMany(PostTagRel::class);

    }
    public static function last()
    {
        return static::all()->last();
    }

    public function getVotesCountAttribute()
    {
        return $this->votes()->count();
    }

    public function getResponsesCountAttribute()
    {
        return $this->responses()->count();
    }

    public function getImageUrlAttribute()
    {
        return $this->getFirstMediaUrl('post_img');
        //the last image for the post is the post image
        // return $this->getMedia('post_img')->last()->getUrl();

    }

    public function getCreatedFormatAttribute()
    {
        return $this->created_at->diffForHumans();
    }

    public function getTagsAttribute()
    {
        return $this->tags()->get();
    }

    public function getUserVoteAttribute()
    {
        if (auth()->check()) {
            return $this->votes()->where('user_id', auth()->user()->id)->first();
        }
        return null;
    }

}
