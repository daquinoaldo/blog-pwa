<?php
  if ($wp->request == "service-worker.js") {
    // prevent 404
    $wp_query->is_404 = false;
    status_header(200);
    // print the file and exit
    header("content-type: application/javascript");
    echo("const SERVER_ROOT = \"".get_template_directory_uri()."\"\n");
    echo("const CACHE_NAME = \"v".get_application_version()."\"\n");
    readfile(dirname(__FILE__)."/service-worker.js");
    exit;
  }

  if ($wp->request == "manifest.json") {
    // prevent 404
    $wp_query->is_404 = false;
    status_header(200);
    // print the file and exit
    header("content-type: application/json");
    echo '
{
  "name": "'.get_bloginfo("name").'",
  "short_name": "'.get_bloginfo("name").'",
  "description": "'.get_bloginfo("description").'",
  "version": "'.get_application_version().'",
  "scope": "/",
  "display": "standalone",
  "background_color": "'.get_colored_header().'",
  "theme_color": "'.get_colored_header().'",
  "icons": [
    {
      "src": "'.get_icon_url("android-192x192.png").'",
      "type": "image/png",
      "sizes": "192x192",
      "purpose": "any maskable"
    },
    {
      "src": "'.get_icon_url("android-512x512.png").'",
      "type": "image/png",
      "sizes": "512x512",
      "purpose": "any maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Search",
      "url": "/search",
      "icons": [{ "src": "'.get_template_directory_uri().'/images/nav/search.svg", "sizes": "192x192" }]
    },
    {
      "name": "Categories",
      "url": "/categories",
      "icons": [{ "src": "'.get_template_directory_uri().'/images/nav/categories.svg", "sizes": "192x192" }]
    }
  ]
}
    ';
    exit;
  }
  
?>