<?php

namespace App\Http\Controllers;

use App\Models\UserHubRel;
use Illuminate\Http\Request;

class UserHubRelController extends Controller
{

    /**
     * Api endpoint to Store a newly created resource in storage, If the user has already subscribed, delete the subscription.
     * @return \Illuminate\Http\RedirectResponse back page with the subscription
     */
    public function store(Request $request)
    {
        $request->validate([
            'hub_id' => 'required',
            'user_id' => 'required',
        ]);

        $hub_id = $request->hub_id;
        $user_id = $request->user_id;

        $isSubscribed = UserHubRel::where('hub_id', $hub_id)->where('user_id', $user_id)->first();

        if ($isSubscribed) {
            $isSubscribed->delete();
        } else {
            $isSubscribed = new UserHubRel();
            $isSubscribed->hub_id = $hub_id;
            $isSubscribed->user_id = $user_id;
            $isSubscribed->save();
        }
        return back();
    }

}
