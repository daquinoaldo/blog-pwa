<?php
  if ($wp->request == "service-worker.js") {
    // prevent 404
    $wp_query->is_404 = false;
    status_header(200);
    // print the file and exit
    header("content-type: application/javascript");
    echo("const SERVER_ROOT = \"".get_template_directory_uri()."\"\n");
    readfile(dirname(__FILE__)."/service-worker.js");
    exit;
  }
?>