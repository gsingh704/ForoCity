<?php

namespace Database\Seeders;

use App\Models\Hub;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use App\Models\PostTagRel;
use App\Models\PostVote;
use App\Models\Response;
use App\Models\UserHubRel;
use App\Models\Conversation;
use App\Models\ResponseVote;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{

    const NO_OF_USERS = 10;
    const NO_OF_HUBS = 5;


    public function run(): void
    {
        //create a admin user
        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@test.com',
            'is_admin' => true
        ]);

        // Create users
        User::factory(self::NO_OF_USERS)->create();

        //create tags
        Tag::factory(10)->create();

        // Create hubs
        Hub::factory(self::NO_OF_HUBS)->create()->each(function ($hub) {
            // $this->generatePosts($hub, rand(3, 5), '-3 years', '-7 days');
            $this->generatePosts($hub, rand(8, 15), '-7 days', 'now');

            $this->generateHubMedia($hub);
        });
        // Create 1-5 user hub rels for each user with random hubs and dont repeat
        $this->generateUserHubRels();

        $this->generateConversations();

        // for user iwth id 1 create 30 posts to test 
        $this->generatePostsForUser(2, 30, '-3 years', '-7 days');
    }

    private function generateConversations(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            $userConversations = [];
            $numberOfConversations = rand(2, 3);
            for ($i = 0; $i < $numberOfConversations; $i++) {
                $receiver = $users->random();
                if (!in_array($receiver->id, $userConversations)) {
                    $userConversations[] = $receiver->id;
                    Conversation::factory(rand(10, 20))
                        ->create([
                            'sender_id' => $user->id,
                            'receiver_id' => $receiver->id
                        ]);
                    //this receiver will send a message back
                    Conversation::factory(rand(10, 20))
                        ->create([
                            'sender_id' => $receiver->id,
                            'receiver_id' => $user->id
                        ]);
                }
            }
        }
    }


    private function generatePostsForUser($userId, $numberOfPosts, $startDate, $endDate): void
    {
        $user = User::find($userId);
        $hubs = Hub::all();

        foreach ($hubs as $hub) {
            Post::factory($numberOfPosts)
                ->createdAtRange($startDate, $endDate)
                ->create(['hub_id' => $hub->id, 'user_id' => $user->id])
                ->each(function ($post) {
                    PostVote::factory(rand(0, 40))->create(['post_id' => $post->id]);
                    $this->createParentResponses($post, rand(0, 3));
                    $this->createChildResponses($post, rand(0, 40));
                    $this->generatePostMedia($post);
                    $this->generatePostTags($post);
                });
        }
    }

    private function generatePostTags($post): void
    {
        $tags = Tag::all();
        $numberOfTags = rand(1, 5);

        for ($i = 0; $i < $numberOfTags; $i++) {
            $tag = $tags->random();
            PostTagRel::factory()->create([
                'post_id' => $post->id,
                'tag_id' => $tag->id
            ]);
        }
    }

    private function generateHubMedia($hub): void
    {
        $hub->addMediaFromUrl('https://via.placeholder.com/128/' . substr($hub->color, 1) . '/fff?text=' . $hub->name[0])
            ->toMediaCollection('hub_img');
    }


    public function generateUserHubRels()
    {
        $users = User::all();
        $hubs = Hub::all();

        foreach ($users as $user) {
            $userHubRels = [];
            $numberOfRels = rand(1, 5);
            for ($i = 0; $i < $numberOfRels; $i++) {
                $hub = $hubs->random();
                if (!in_array($hub->id, $userHubRels)) {
                    $userHubRels[] = $hub->id;
                    UserHubRel::factory()->create([
                        'user_id' => $user->id,
                        'hub_id' => $hub->id
                    ]);
                }
            }
        }
    }

    private function generatePosts($hub, $numberOfPosts, $startDate, $endDate): void
    {
        Post::factory($numberOfPosts)
            ->createdAtRange($startDate, $endDate)
            ->create(['hub_id' => $hub->id])
            ->each(function ($post) {
                PostVote::factory(rand(0, 40))->create(['post_id' => $post->id]);
                $this->createParentResponses($post, rand(0, 3));
                $this->createChildResponses($post, rand(0, 40));
                $this->generatePostMedia($post);
            });
    }

    private function generatePostMedia($post): void
    {
        if (rand(0, 1)) {
            $post->addMediaFromUrl('https://picsum.photos/seed/' . $post->title . '/200/300')
                ->toMediaCollection('post_img');
        }
    }


    private function createParentResponses($post, $numberOfResponses): void
    {
        Response::factory($numberOfResponses)->create([
            'post_id' => $post->id,
            'parent_id' => null
        ])->each(function ($response) {
            ResponseVote::factory(rand(0, 20))->create(['response_id' => $response->id]);
        });
    }

    private function createChildResponses($post, $numberOfResponses): void
    {
        // Pre-fetch all existing responses for the post
        $responses = Response::where('post_id', $post->id)->pluck('id')->all();

        // Exit if there are no responses
        if (empty($responses)) {
            return;
        }

        for ($i = 0; $i < $numberOfResponses; $i++) {
            // Create a new response
            $newResponse = Response::factory()->create([
                'post_id' => $post->id,
                'parent_id' => $this->getRandomParentId($responses)
            ]);

            // Update the responses array with the new ID
            $responses[] = $newResponse->id;

            // Create response votes
            ResponseVote::factory(rand(0, 20))->create(['response_id' => $newResponse->id]);
        }
    }

    private function getRandomParentId($responses)
    {
        return $responses[array_rand($responses)];
    }

}
