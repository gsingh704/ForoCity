<?php

namespace App\Http\Controllers;

use App\Models\ResponseVote;
use Illuminate\Http\Request;

class ResponseVoteController extends Controller
{

    /**
     * Api endpoint to Store a newly created resource in storage, If the user has already voted, delete the vote.
     * @return \Illuminate\Http\RedirectResponse back page with the vote
     */
    public function store(Request $request)
    {
        $request->validate([
            'response_id' => 'required',
            'user_id' => 'required',
        ]);

        $response_id = $request->response_id;
        $user_id = $request->user_id;

        $vote = ResponseVote::where('response_id', $response_id)->where('user_id', $user_id)->first();

        if ($vote) {
            $vote->delete();
        } else {
            $vote = new ResponseVote();
            $vote->response_id = $response_id;
            $vote->user_id = $user_id;
            $vote->save();
        }
        return back();
    }
}
