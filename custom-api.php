<?php

function get_all_posts() {
  // get the posts
  $posts = get_posts(array(
    "numberposts" => -1,
    "orderby"    => "title",
    "sort_order" => "asc"
  ));

  // remove unused fields
  $posts = array_map(function ($post) {
    return (object) [
      "slug" => $post->post_name,
      "title" => $post->post_title,
      "content" => $post->post_content
    ];
  }, $posts);

  return $posts;
}


add_action("rest_api_init", function() {
  register_rest_route("simple-pwa/v1", "/posts", array(
    "methods" => "GET",
    "callback" => "get_all_posts"
  ));
});

?>