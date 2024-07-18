<?php
namespace App\Helpers;

use App\Models\Post;

class HubPostHelper
{

    public static function allHub()
    {
        $hub = [
            'name' => 'all',
            'description' => 'All posts from all hubs',
            'image_url' => 'https://via.placeholder.com/128/2563eb/fff?text=A',
        ];
        return $hub;
    }

    public static function userHub()
    {
        $hub = [
            'name' => 'me',
            'description' => 'All posts from your joined hubs',
            'image_url' => 'https://via.placeholder.com/128/c2410c/fff?text=M',
        ];
        return $hub;
    }

    public static function getSortedPosts($hubIds, $sort, $userId = null)
    {
        $query = Post::with('user', 'hub');

        if ($userId) {
            // Fetch posts from this user
            $query->where('posts.user_id', $userId);
        } elseif (is_array($hubIds)) {
            // Fetch posts from these hubs
            $query->whereIn('hub_id', $hubIds);
        } elseif ($hubIds !== null) {
            // Fetch posts from this hub
            $query->where('hub_id', $hubIds);
        }
        switch ($sort) {
            case 'top':
                return $query->leftJoin('post_votes', 'posts.id', '=', 'post_votes.post_id')
                    ->selectRaw('posts.*, COUNT(post_votes.id) as votes_count')
                    ->groupBy('posts.id')
                    ->orderBy('votes_count', 'desc');
                    // ->paginate(10);

            case 'hot':
                return $query->leftJoin('responses', 'posts.id', '=', 'responses.post_id')
                    ->selectRaw('posts.*, COUNT(responses.id) as responses_count')
                    ->groupBy('posts.id')
                    ->orderBy('responses_count', 'desc');
                    // ->paginate(10);
            case 'new':
            default:
                return $query->orderBy('created_at', 'desc');
                // ->paginate(10);
        }
    }
}