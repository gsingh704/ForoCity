<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Response>
 */
class ResponseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'content' => fake()->paragraph(),
            'user_id' => fake()->numberBetween(2, 11),
            // 'post_id' => fake()->numberBetween(1, 10),
            // created time between now and 7 days ago
            'created_at' => fake()->dateTimeBetween('-7 days', 'now'),
        ];
    }
}
