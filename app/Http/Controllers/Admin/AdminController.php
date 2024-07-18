<?php

namespace App\Http\Controllers\Admin;

use App\Models\Hub;
use App\Models\Post;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AdminController extends Controller
{
    public function index()
    {
        //count users, hubs, posts
        $userCount = User::count();
        $hubCount = Hub::count();
        $postCount = Post::count();

        return Inertia::render('Admin/DashBoard', [
            'userCount' => $userCount,
            'hubCount' => $hubCount,
            'postCount' => $postCount,
        ]);
    }
}
