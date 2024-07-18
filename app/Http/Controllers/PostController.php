<?php

namespace App\Http\Controllers;

use App\Models\Hub;
use App\Models\Tag;
use App\Models\Post;
use App\Models\User;
use Inertia\Inertia;
use App\Models\PostTagRel;
use App\Models\UserHubRel;
use Illuminate\Http\Request;
use App\Helpers\HubPostHelper;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;


class PostController extends Controller
{
    /**
     * Show the form for creating a new resource.
     * @param Hub $hub
     */
    public function create(Hub $hub)
    {
        //get all the tags from the tags table
        $tags = Tag::all();


        return Inertia::render('Post/CreatePost', [
            'hub' => $hub,
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created post in storage.
     * @param \Illuminate\Http\Request $request the request
     * @return \Illuminate\Http\RedirectResponse the new post page
     */
    public function store(Request $request)
    {
        // dd($request->all());

        $request->validate([
            'title' => 'required|string|max:255',
            'content_body' => 'nullable|string|max:255',
            'hub_id' => 'required',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            //tag is an array of with id that should exist in the tags table
            'tags' => 'nullable|array',
            'tags.*' => 'nullable|exists:tags,id',
        ]);

        $post = Post::create([
            'title' => $request->title,
            'content' => $request->content_body,
            'hub_id' => $request->hub_id,
            'user_id' => auth()->user()->id,
        ]);

        //create new post_tag_rel for each tag
        if ($request->tags) {
            foreach ($request->tags as $tag) {
                PostTagRel::create([
                    'post_id' => $post->id,
                    'tag_id' => $tag,
                ]);
            }
        }

        if ($request->hasFile('img')) {
            $post->addMediaFromRequest('img')->toMediaCollection('post_img');
        }

        session()->flash('success', 'Post created successfully.');

        return redirect()->route('post.show', ['hub' => $post->hub->name, 'post' => $post->id]);
    }

    /**
     * Display the specified Post.
     * @param Hub $hub
     * @param string $id the id of the post
     * @return \Inertia\Response the post page
     */
    public function show(Hub $hub, string $id)
    {
        $post = Post::with('user', 'hub', 'responses.user')->where('posts.id', $id)->firstOrFail();

        return Inertia::render('Post/ShowPost', [
            'post' => $post,
        ]);
    }

    /**
     * Api endpoint for getting posts by hub name.
     * @param Request $request
     * @param string $name the name of the hub
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPostsByHubName(Request $request, string $name)
    {
        $sort = $request->query('sort', 'new');
        $searchQuery = $request->query('query', '');
        $hubId = null;
        $userId = null;

        if ($name === 'all') {
            // Fetch posts from all hubs
        } elseif ($name === 'me') {
            $userHubs = UserHubRel::where('user_id', Auth::id())->pluck('hub_id')->toArray();
            $hubId = $userHubs;
        } elseif (substr($name, 0, 2) === 'u_') {
            $userName = substr($name, 2);
            $user = User::where('name', $userName)->firstOrFail();
            $userId = $user->id;
        } else {
            $hub = Hub::where('name', $name)->firstOrFail();
            $hubId = $hub->id;
        }

        $posts = HubPostHelper::getSortedPosts($hubId, $sort, $userId);

        // If there is a search query, filter the posts
        if ($searchQuery) {
            $posts = $posts->where('title', 'like', '%' . $searchQuery . '%');
        }

        $tagIds = $request->query('tags'); // Retrieve the tag IDs from the request

        // Filter by tags from post_tag_rel table
        if ($tagIds) {
            $posts = $posts->whereHas('tags', function ($query) use ($tagIds) {
                $query->whereIn('tag_id', $tagIds);
            });
        }

        $posts = $posts->paginate(10);
        return response()->json([
            'posts' => $posts,
        ]);
    }

    /**
     * Api endpoint for deleting a post.
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'user_id' => 'required',
        ]);

        $id = $request->id;
        $user_id = $request->user_id;

        //delete the post if the user is the owner of the post or if the user is an admin
        if ($user_id == Auth::id() || Auth::user()->is_admin) {
            $post = Post::find($id);
            if ($post) {
                $post->delete();
                return response()->json(['success' => true]);
            }
        }
        return response()->json(['success' => false]);
    }

    /**
     * Show the form for editing the specified resource.
     * @param string $name the name of the hub
     * @param string $id the id of the post
     * @return \Inertia\Response the edit post page
     */
    public function edit(string $name, string $id)
    {
        $hub = Hub::where('name', $name)->firstOrFail();
        $post = Post::where('id', $id)->firstOrFail();

        //get all the tags from the tags table
        $tags = Tag::all();

        //get all the tags from the post_tag_rel table
        $postTags = PostTagRel::where('post_id', $post->id)->pluck('tag_id')->toArray();

        return Inertia::render('Post/EditPost', [
            'hub' => $hub,
            'post' => $post,
            'tags' => $tags,
            'postTags' => $postTags,
        ]);
    }

    /**
     * Update the specified resource in storage.
     * @param \Illuminate\Http\Request $request the request
     * @return \Illuminate\Http\RedirectResponse the post page
     */
    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'title' => 'required|string|max:255',
            'content_body' => 'nullable|string|max:255',
            'hub_id' => 'required',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            //tag is an array of with id that should exist in the tags table
            'tags' => 'nullable|array',
            'tags.*' => 'nullable|exists:tags,id',
        ]);

        $post = Post::find($request->id);

        //update the post if the user is the owner of the post or if the user is an admin
        if ($post->user_id == Auth::id() || Auth::user()->is_admin) {
            $post->update([
                'title' => $request->title,
                'content' => $request->content_body,
                'hub_id' => $request->hub_id,
            ]);

            //delete all the post_tag_rel for this post
            PostTagRel::where('post_id', $post->id)->delete();

            //create new post_tag_rel for each tag
            if ($request->tags) {
                foreach ($request->tags as $tag) {
                    PostTagRel::create([
                        'post_id' => $post->id,
                        'tag_id' => $tag,
                    ]);
                }
            }

            if ($request->hasFile('img')) {
                $post->addMediaFromRequest('img')->toMediaCollection('post_img');
            }

            session()->flash('success', 'Post updated successfully.');

            return redirect()->route('post.show', ['hub' => $post->hub->name, 'post' => $post->id]);
        }

        session()->flash('error', 'You are not authorized to update this post.');

        return redirect()->route('post.show', ['hub' => $post->hub->name, 'post' => $post->id]);
    }
}