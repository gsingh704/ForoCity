<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Helpers\HubPostHelper;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        if (Auth::check()) {
            if (Auth::user()->is_admin) {
                return inertia_location('/admin');
            }
            $hub = HubPostHelper::userHub();
        } else {
            $hub = HubPostHelper::allHub();
        }

        $tags = Tag::all();

        return Inertia::render('Home', [
            'hub' => $hub,
            'tags' => $tags,
        ]);
    }

}
