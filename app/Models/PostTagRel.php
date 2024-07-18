<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostTagRel extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'tag_id',
    ];

    //appends name and color to the tag
    protected $appends = [
        'name',
        'color',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    //get the name of the tag
    public function getNameAttribute()
    {
        return Tag::find($this->tag_id)->name;
    }

    //get the color of the tag
    public function getColorAttribute()
    {
        return Tag::find($this->tag_id)->color;
    }
}
