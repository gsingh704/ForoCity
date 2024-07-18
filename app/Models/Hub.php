<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Hub extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $fillable = [
        'name',
        'description',
        'country',
        'user_id',
        'color',
    ];

    protected $appends = [
        'image_url',
        'user_count',
    ];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function userHubRels()
    {
        return $this->hasMany(UserHubRel::class);
    }

    //get image url
    public function getImageUrlAttribute()
    {
        // return $this->getFirstMediaUrl('hub_img');
        //the last image for the hub is the hub image
        return $this->getMedia('hub_img')->last()->getUrl();
    }

    //get user count table user_hub_rel with hub_id
    public function getUserCountAttribute()
    {
        return $this->userHubRels()->count();
    }

}
