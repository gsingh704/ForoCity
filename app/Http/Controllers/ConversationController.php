<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Conversation;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = auth()->id(); // Assuming you have authentication and you can get the current user's ID

        // Fetch conversations where the current user is either the sender or the receiver
        $conversations = Conversation::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->get();

        // Group by the other party in the conversation and get the last message
        $grouped = $conversations->groupBy(function ($conversation) use ($userId) {
            return $conversation->sender_id === $userId ? $conversation->receiver_id : $conversation->sender_id;
        });

        $lastMessages = $grouped->map(function ($group) {
            return $group->sortByDesc('created_at')->first();
        });

        return Inertia::render('Conversation/List', [
            'conversations' => $lastMessages
        ]);
    }


    /**
     * Show the a specific conversation.
     */

    public function show($username, $otherUsername)
    {
        $userId = auth()->id();
        $otherUser = User::where('name', $otherUsername)->firstOrFail();

        // Fetch conversations where the current user is either the sender or the receiver and the other user is either the sender or the receiver, and order by created_at
        $conversations = Conversation::where(function ($query) use ($userId, $otherUser) {
            $query->where('sender_id', $userId)
                ->where('receiver_id', $otherUser->id);
        })->orWhere(function ($query) use ($userId, $otherUser) {
            $query->where('sender_id', $otherUser->id)
                ->where('receiver_id', $userId);
        })->orderBy('created_at')->get();
        


        return Inertia::render('Conversation/Show', [
            'conversations' => $conversations,
            'otheruser' => $otherUser
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        //dd($request->content_body);
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content_body' => 'required|string'
        ]);

        $conversation = Conversation::create([
            'content' => $request->content_body,
            'sender_id' => auth()->id(),
            'receiver_id' => $request->receiver_id
        ]);

        //return back to previous page to #bottom
        return inertia_location('/u/' . auth()->user()->name . '/c/' . User::find($request->receiver_id)->name . '#bottom');
    }
}