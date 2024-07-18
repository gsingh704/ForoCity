<?php

namespace App\Http\Controllers;

use App\Models\PostVote;
use Illuminate\Http\Request;

class PostVoteController extends Controller
{


    /**
     * Api endpoint to Store a newly created resource in storage, If the user has already voted, delete the vote.
     * @return \Illuminate\Http\RedirectResponse back page with the vote
     */
    public function store(Request $request)
    {
        $request->validate([
            'post_id' => 'required',
            'user_id' => 'required',
        ]);

        $post_id = $request->post_id;
        $user_id = $request->user_id;

        $vote = PostVote::where('post_id', $post_id)->where('user_id', $user_id)->first();

        if ($vote) {
            $vote->delete();
        } else {
            $vote = new PostVote();
            $vote->post_id = $post_id;
            $vote->user_id = $user_id;
            $vote->save();
        }
        return back();
    }

}
