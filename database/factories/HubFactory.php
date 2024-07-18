<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Hub>
 */
class HubFactory extends Factory
{

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // hub name is unique and slugified
            'name' => Str::slug(fake()->unique()->city()),
            'description' => fake()->text(),
            'country' => fake()->countryCode(),
            'color' => fake()->hexColor(),
            'user_id' => fake()->numberBetween(2, 11),
        ];
    }
}
