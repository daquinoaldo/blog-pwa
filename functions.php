<?php

/* == CONFIGS & GETTERS ========== */
function get_default_icon_url($filename = "") { //TODO: tasto reset
  return get_template_directory_uri() . "/images/icons/" . $filename;
}
function get_default_icon_path($filename = "") {
  return get_template_directory() . "/images/icons/" . $filename;
}
function get_custom_icon_url($filename = "") {
  return "/wp-content/uploads/blog-pwa/" . $filename;
}
function get_custom_icon_path($filename = "") {
  return $_SERVER["DOCUMENT_ROOT"] . get_custom_icon_url($filename);
}
function get_icon_url($filename = "") {
  return get_option("application_icon_path", get_custom_icon_url()) . $filename;
}
function get_colored_header() {
  return get_option("colored_header", "#0288d1");
}


/* == SETTINGS PAGE ========== */
function theme_settings_page() {
  ?>
    <div class="wrap">
      <h1>Theme Panel</h1>
      <?php settings_errors(); ?>
      <form method="post" enctype="multipart/form-data" action="options.php">
        <?php
          settings_fields("section");               // nonce, etc.
          do_settings_sections("theme-settings");   // fields
          submit_button();                          // submit button
        ?>
      </form>
    </div>
  <?php
}

function init_theme_settings_page() {
  add_menu_page(
    "Theme settings",      // page title
    "Theme settings",      // menu title
    "manage_options",      // capability
    "theme-settings",      // menu slug
    "theme_settings_page"  // callback
  );
}

add_action("admin_menu", "init_theme_settings_page");


/* == SETTINGS FIELDS ========== */

/* display functions */
function display_colored_header_setting()  {
  ?>
    <input type="text" name="colored_header" id="colored_header" class="color-picker" value="<?php echo get_colored_header() ?>" />
    <script>
    jQuery(document).ready(function($){
      $(".color-picker").wpColorPicker();
    });
    </script>
  <?php
}

function display_application_icon_setting() {
  ?>
    <img width="180" src="<?php echo get_icon_url("android-192x192.png") ?>">
    <img width="180" src="<?php echo get_icon_url("apple-touch-icon.png") ?>">
    <img width="180" src="<?php echo get_icon_url("msapplication-tile.png") ?>">
    <br><br>
    <input type="file" name="application_icon" id="application_icon" />
    <input type="checkbox" name="reset_application_icon" id="reset_application_icon" />Reset to default icon
  <?php
}

function application_icon_upload_handler($options) {
  $input_file = $_FILES["application_icon"]["tmp_name"];

  // reset option selected, return the default url
  if ($_POST["reset_application_icon"])
    return get_default_icon_url();

  // no upload, return the old file url
  if (empty($input_file))
    return get_option("application_icon_path");
  
  // not an image, return the old file url
  $mime = getimagesize($input_file)["mime"];
  if ($mime != "image/jpeg" && $mime != "image/jpg" && $mime != "image/png") {
    add_settings_error("application_icon_path", 1, "Invalid mime type.");
    return get_option("application_icon_path");
  }

  // prepare images and return the new url
  $original = $input_file;
  $android_mask = get_default_icon_path("android-mask.png");
  $iphone_mask = get_default_icon_path("iphone-mask.png");
  $android = get_custom_icon_path("android-512x512.png");
  $iphone = get_custom_icon_path("apple-touch-icon.png");
  crop($original, $android_mask, $android);
  crop($original, $iphone_mask, $iphone);
  resize($android,  512, 512, get_custom_icon_path("android-512x512.png"));
  resize($android,  192, 192, get_custom_icon_path("android-192x192.png"));
  resize($iphone,   180, 180, get_custom_icon_path("apple-touch-icon.png"));
  resize($original, 270, 270, get_custom_icon_path("msapplication-tile.png"));
  resize($original, 64,  64,  get_custom_icon_path("favicon-64x64.png"));
  resize($original, 48,  48,  get_custom_icon_path("favicon-48x48.png"));
  resize($original, 32,  32,  get_custom_icon_path("favicon-32x32.png"));
  resize($original, 16,  16,  get_custom_icon_path("favicon-16x16.png"));
  return get_custom_icon_url();
}

/* register the functions */
function init_theme_settings_fields() {
  add_settings_section("section", "All Settings", null, "theme-settings");

  add_settings_field(
    "colored_header",                   // slug
    "Colored header",                   // title
    "display_colored_header_setting",   // callback
    "theme-settings",                   // page
    "section"                           // section
  );

  add_settings_field("application_icon_path", "Application icon", "display_application_icon_setting", "theme-settings", "section");
  
  register_setting("section", "colored_header");
  register_setting("section", "application_icon_path", "application_icon_upload_handler");
}

add_action("admin_init", "init_theme_settings_fields");


/* == COLOR PICKER ========== */
function theme_settings_enqueue_color_picker($hook_suffix) {
  if (empty($_GET["page"]) || $_GET["page"] !== "theme-settings") return; // only in that page
  wp_enqueue_style("wp-color-picker");
  wp_enqueue_script( "wp-color-picker");
}
add_action("admin_enqueue_scripts", "theme_settings_enqueue_color_picker");


/* == UTILITIES ========== */
function resize($input_file, $width, $height, $output_file = "") {
  if ($output_file == "")
    $output_file = $input_file;
  
  $image_editor = wp_get_image_editor($input_file);
  if (!is_wp_error($image_editor)) {
    // set the maximum quality
    $image_editor->set_quality(100);
    
    // ensure is not smaller
    $size = $image_editor->get_size();

    $src_width = $size["width"];
    $src_height = $size["height"];

    if ($src_width < $width) {
      $ratio = $width/$src_width;
      $src_width = $width;
      $src_height = $ratio * $src_height;
    }

    if ($src_height < $height) {
      $ratio = $height/$src_height;
      $src_height = $height;
      $src_width = $ratio * $src_width;
    }
    
    $image_editor->crop(0, 0, $size["width"], $size["height"], $src_width, $src_height, false);

    // ensure is not bigger
    $image_editor->resize($width, $height, true);
    
    // save
    $image_editor->save($output_file);
  }
}

/* crop function */
function crop($input_file, $mask_file, $output_file = "") {
  if ($output_file == "")
    $output_file = $input_file;

  // dimensions
  $mask_size = getimagesize($mask_file );
  $width = $mask_size[0];
  $height = $mask_size[1];

  // make the image square and resize to the wanted size
  resize($input_file, $width, $height, $output_file);

  // load image
  $src = imagecreatefromstring(file_get_contents($output_file));
  $mask = imagecreatefromstring(file_get_contents($mask_file));

  // prepare empty image with transparency
  $out = imagecreatetruecolor($width, $height);
  imagealphablending($out, false);

  // transparent pixel
  $transparent = imagecolorallocatealpha($out, 0, 0, 0, 127);

  // iterate through pixels and decide which keep
  for ($x = 0; $x < $width ; $x++) {
    for ($y = 0; $y < $height ; $y++) {
      $mask_pixel = imagecolorat($mask, $x, $y);
      $alpha = imagecolorsforindex($mask, $mask_pixel)["alpha"];

      if ($alpha < 127) {
        $src_pixel = imagecolorat($src, $x, $y);
        imagesetpixel($out, $x, $y, $src_pixel);
      }
      else imagesetpixel($out, $x, $y, $transparent);
    }
  }

  // export the image
  imagesavealpha($out, true);
  imagepng($out, $output_file);

  // deallocate images
  imagedestroy($src);
  imagedestroy($mask);
  imagedestroy($out);
}

?>