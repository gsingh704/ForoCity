<?php

namespace App\Http\Controllers\Auth;

use App\Models\Tag;
use App\Models\Post;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();

        //for each user , count posts and responses
        foreach ($users as $user) {
            $user->response_count = Response::where('user_id', $user->id)->count();
            $user->post_count = Post::where('user_id', $user->id)->count();

            // //count the votes for each posts
            // $total_votes = 0;
            // $posts = Post::where('user_id', $user->id)->get();

            // foreach ($posts as $post) {
            //     $total_votes += $post->votes_count;
            // }

            // $responses = Response::where('user_id', $user->id)->get();

            // foreach ($responses as $response) {
            //     $total_votes += $response->votes_count;
            // }

            // $user->total_votes = $total_votes;

        }
        return Inertia::render('Admin/UserList', [
            'users' => $users,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $name)
    {
        $user = User::where('name', $name)->firstOrFail();
        $tags= Tag::all();

        return Inertia::render('User/ShowUser', [
            'user' => $user,
            'tags' => $tags,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $user = User::find($request->user_id);
        $user->delete();
        return redirect()->back()->with('success', 'User deleted successfully.');
    }


}