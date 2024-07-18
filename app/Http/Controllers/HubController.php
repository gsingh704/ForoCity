<?php

namespace App\Http\Controllers;

use App\Models\Hub;
use App\Models\Tag;
use Inertia\Inertia;
use App\Models\UserHubRel;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Helpers\HubPostHelper;
use Illuminate\Support\Facades\Auth;

/**
 * The `HubController` extends from the base `Controller` class. It primarily manages the `Hub` objects, which represent groups or communities within an application.
 * The class contains methods for the basic CRUD (Create, Read, Update, Delete) operations and additional methods for managing Hubs.
 *
 * The `index()` method renders a page with a list of all hubs.
 * The `create()` method shows a form for creating a new Hub.
 * The `store(Request $request)` method stores a newly created Hub in the storage and handles all the processes involved.
 * The `show(string $name)` method displays a specific Hub identified by its name.
 * The `userhub()` method displays a list of Hubs that the current user is a member of.
 **/
class HubController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return \Inertia\Response the page with all hubs
     */
    public function index()
    {
        //list of all hubs
        $hubs = Hub::all();

        //for all hub,see if the user is subscribed to the hub
        if (Auth::check()) {
            $userHubs = UserHubRel::where('user_id', auth()->user()->id)->pluck('hub_id');
            foreach ($hubs as $hub) {
                if ($userHubs->contains($hub->id)) {
                    $hub->isSubscribed = true;
                } else {
                    $hub->isSubscribed = null;
                }
            }
        }

        return Inertia::render('Hub/ListHub', [
            'hubs' => $hubs,
            'listName' => 'All Hubs',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * @return \Inertia\Response the create hub page
     */
    public function create()
    {
        return Inertia::render('Hub/CreateHub');
    }

    /**
     * Store a newly created hub in storage.
     * @param \Illuminate\Http\Request $request the request
     * @return \Illuminate\Http\RedirectResponse the hub page
     */
    public function store(Request $request)
    {
        //add slug before validation
        $request->request->add(['name' => Str::slug($request->name, '_')]);


        $request->validate([
            'name' => 'required|string|max:255|unique:hubs',
            'description' => 'required|string|max:255',
            'country' => 'required|string|max:2',
            // check if color is a valid hex color
            'color' => 'required|regex:/^#[a-f0-9]{6}$/i',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $hub = Hub::create([
            'name' => $request->name,
            'description' => $request->description,
            'country' => $request->country,
            'color' => $request->color,
            'user_id' => auth()->user()->id,
        ]);

        if ($request->hasFile('img')) {
            $hub->addMediaFromRequest('img')->toMediaCollection('hub_img');
        } else {
            //add placeholder image
            $hub->addMediaFromUrl('https://via.placeholder.com/128/' . substr($hub->color, 1) . '/fff?text=' . $hub->name[0])
                ->toMediaCollection('hub_img');
        }

        //the user who created the hub is automatically subscribed to the hub
        UserHubRel::create([
            'user_id' => auth()->user()->id,
            'hub_id' => $hub->id,
        ]);

        // //if failed to create hub, redirect back to create hub page
        // if (!$hub) {
        //     return redirect()->route('hub.create')->with('error', 'Failed to create hub.');
        // }

        return redirect()->route('hub.show', $hub->name)->with('success', 'Hub created successfully.');
    }

    /**
     * Display the specified resource.
     * @param string $name the name of the hub
     * @return \Inertia\Response the hub page
     */
    public function show(string $name)
    {
        if ($name === 'all') {
            $hub = HubPostHelper::allHub();
        } else {
            $hub = Hub::where('name', $name)->firstOrFail();
            $hub->image_url = $hub->getFirstMediaUrl('hub_img');
        }

        $tags = Tag::all();

        return Inertia::render('Home', [
            'hub' => $hub,
            'tags' => $tags,
        ]);
    }


    /**
     * Display a listing of the user's hubs.
     */
    public function userhub()
    {
        $hubsId = UserHubRel::where('user_id', auth()->user()->id)->pluck('hub_id');
        $hubs = Hub::whereIn('id', $hubsId)->get();

        //set isSubscribed to true for all hubs
        foreach ($hubs as $hub) {
            $hub->isSubscribed = true;
        }

        return Inertia::render('Hub/ListHub', [
            'hubs' => $hubs,
            'listName' => 'My Hubs',
        ]);
    }

    /**
     * Api endpoint for deleting a hub.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'user_id' => 'required'
        ]);

        $id = $request->id;
        $user_id = $request->user_id;

        //check if the user is the owner of the hub, or is an admin
        if (Auth::user()->is_admin || $user_id == Auth::id()) {
            $hub = Hub::find($id);
            if ($hub) {
                $hub->delete();
                return response()->json(['success' => true]);
            }
        }
        return response()->json(['success' => false]);
    }

    /**
     * Show the form for editing the specified resource.
     * @param string $name the name of the hub
     * @return \Inertia\Response the edit hub page
     */
    public function edit(string $name)
    {
        $hub = Hub::where('name', $name)->firstOrFail();
        $hub->image_url = $hub->getFirstMediaUrl('hub_img');

        return Inertia::render('Hub/EditHub', [
            'hub' => $hub,
        ]);
    }

    /**
     * Update the specified resource in storage.
     * @param \Illuminate\Http\Request $request the request
     * @return \Illuminate\Http\RedirectResponse the hub page
     */
    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'description' => 'required|string|max:255',
            'country' => 'required|string|max:2',
            // check if color is a valid hex color
            'color' => 'required|regex:/^#[a-f0-9]{6}$/i',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $hub = Hub::find($request->id);

        //check if the user is the owner of the hub, or is an admin
        if (Auth::user()->is_admin || $hub->user_id == Auth::id()) {
            $hub->description = $request->description;
            $hub->country = $request->country;
            $hub->color = $request->color;
            $hub->save();

            if ($request->hasFile('img')) {
                $hub->addMediaFromRequest('img')->toMediaCollection('hub_img');
            }

            return redirect()->route('hub.show', $hub->name)->with('success', 'Hub updated successfully.');
        }

        return redirect()->route('hub.show', $hub->name)->with('error', 'Failed to update hub.');
    }
}