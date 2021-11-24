<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // create fake comment
        return [
            'user_id' => User::factory(),
            'post_id' => Post::factory(),
            'content' => $this->faker->sentence(3),
        ];
    }
}
