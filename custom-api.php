<?php

// Set the last edit date to the installation date
add_option("last_edit_date", current_time("mysql"));

// Update the last edit dat every time a post is added, edited or deleted
function update_last_edit_date() {
  update_option("last_edit_date", current_time("mysql"));
}
add_action('post_updated', 'update_last_edit_date');
add_action('delete_post', 'update_last_edit_date');

// ROUTE /posts
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

// ROUTE /last_edit_date
function get_last_edit_date() {
  return get_option("last_edit_date", "unknown");
}

// Register routes
add_action("rest_api_init", function() {
  register_rest_route("simple-pwa/v1", "/posts", array(
    "methods" => "GET",
    "callback" => "get_all_posts"
  ));
  register_rest_route("simple-pwa/v1", "/last-edit-date", array(
    "methods" => "GET",
    "callback" => "get_last_edit_date"
  ));
});

?>