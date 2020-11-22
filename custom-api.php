<?php

// Set the last edit date to the installation date
add_option("last_edit", current_time("timestamp"));

// Update the last edit dat every time a post is added, edited or deleted
function update_last_edit() {
  update_option("last_edit", current_time("timestamp"));
}
add_action('post_updated', 'update_last_edit');
add_action('delete_post', 'update_last_edit');


// ROUTE /last_edit
function get_last_edit() {
  return get_option("last_edit", "unknown");
}

function map_to_slug($list) {
  $list = array_map(function ($item) { return $item->slug; }, $list);
  if (is_null($list)) return [];
  else return $list;
}

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
      "content" => do_shortcode($post->post_content),
      "categories" => map_to_slug(get_the_category($post->ID)),
      "tags" => map_to_slug(get_the_tags($post->ID))
    ];
  }, $posts);

  return $posts;
}

// ROUTE /pages
function get_all_pages() {
  // get the pages
  $pages = get_pages(array(
    "numberpages" => -1,
    "orderby"    => "title",
    "sort_order" => "asc"
  ));

  // remove unused fields
  $pages = array_map(function ($page) {
    return (object) [
      "slug" => $page->post_name,
      "title" => $page->post_title,
      "content" => do_shortcode($page->post_content)
    ];
  }, $pages);

  return $pages;
}

// ROUTE /categories
function get_all_categories() {
  // get the categories
  $categories = get_categories();

  // remove unused fields
  $categories = array_map(function ($category) {
    return (object) [
      "slug" => $category->slug,
      "name" => $category->name
    ];
  }, $categories);

  return $categories;
}

// ROUTE /tags
function get_all_tags() {
  // get the tags
  $tags = get_tags();

  // remove unused fields
  $tags = array_map(function ($category) {
    return (object) [
      "slug" => $category->slug,
      "name" => $category->name
    ];
  }, $tags);

  return $tags;
}


// Register routes
add_action("rest_api_init", function() {
  $base_url = "simple-pwa/v1";
  register_rest_route($base_url, "/last-edit", array(
    "methods" => "GET",
    "callback" => "get_last_edit"
  ));
  register_rest_route($base_url, "/posts", array(
    "methods" => "GET",
    "callback" => "get_all_posts"
  ));
  register_rest_route($base_url, "/pages", array(
    "methods" => "GET",
    "callback" => "get_all_pages"
  ));
  register_rest_route($base_url, "/categories", array(
    "methods" => "GET",
    "callback" => "get_all_categories"
  ));
  register_rest_route($base_url, "/tags", array(
    "methods" => "GET",
    "callback" => "get_all_tags"
  ));
});

?>
