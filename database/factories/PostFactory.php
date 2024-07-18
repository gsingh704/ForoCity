<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'content' => fake()->paragraph(),
            'user_id' => fake()->numberBetween(2, 11),
            'hub_id' => fake()->numberBetween(1, 10),            
        ];
    }

    public function createdAtRange($startDate, $endDate)
    {
        return $this->state(function (array $attributes) use ($startDate, $endDate) {
            return [
                'created_at' => fake()->dateTimeBetween($startDate, $endDate),
            ];
        });
    }
}
