<?php

require_once(get_template_directory() . "/theme-settings.php");
require_once(get_template_directory() . "/custom-api.php");

// Setup the language
add_action('after_setup_theme', function() {
  load_theme_textdomain("simple-pwa", get_template_directory().'/languages');
});

?>