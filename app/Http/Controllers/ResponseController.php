<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Response;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ResponseController extends Controller
{
    /**
     * Store a newly created response in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content_body' => 'required',
            'user_id' => 'required',
            'post_id' => 'required',
            'parent_id' => 'nullable',
        ]);

        $response = Response::create([
            'content' => $request->content_body,
            'user_id' => $request->user_id,
            'post_id' => $request->post_id,
            'parent_id' => $request->parent_id,
        ]);

        $url = "/h/{$request->hub_name}/p/{$request->post_id}#{$response->id}";
        return inertia_location($url);
    }

    /**
     * api endpoint to get all responses of a user
     * @param string $name the name of the user
     * @return \Illuminate\Http\JsonResponse list of responses
     */
    public function getResponsesByUserName(Request $request, string $name)
    {
        $sort = $request->query('sort', 'new');
        $user = User::where('name', $name)->firstOrFail();


        //get all the users responses , but some responses are have content set to [deleted] so we dont want to show them
        $responses = Response::where('user_id', $user->id)->where('content', '!=', '[deleted]');

        if ($sort === 'top') {
            $responsesSub = $responses->selectRaw('responses.*, COUNT(response_votes.id) as votes_count')
                ->leftJoin('response_votes', 'responses.id', '=', 'response_votes.response_id')
                ->groupBy('responses.id');
            $responses = $responsesSub->orderBy('votes_count', 'desc')->paginate(20);
        } else {
            $responses = $responses->orderBy('created_at', 'desc')->paginate(20);
        }

        //for each user get hub name of the response
        foreach ($responses as $response) {
            $response->hub_name = Post::where('id', $response->post_id)->first()->hub->name;
        }
        ;

        return response()->json([
            'responses' => $responses,
        ]);
    }

    /**
     * Setting content of a response to [deleted] if the user is the owner of the response
     * @return \Illuminate\Http\JsonResponse success or not
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'user_id' => 'required',
        ]);

        $id = $request->id;
        $user_id = $request->user_id;

        //delete the response if the user is the owner of the response or if the user is an admin
        if (Auth::user()->is_admin || $user_id == Auth::id()) {
            $response = Response::find($id);

            $response->content = '[deleted]';
            $response->save();
            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false]);
    }

}
