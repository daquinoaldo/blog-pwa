<?php require_once(get_template_directory() . "/pwa-handler.php") ?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><?php bloginfo('name') ?></title>
    <meta name="Description" content="<?php bloginfo('description') ?>">
    <meta http-equiv=X-UA-Compatible content="IE=edge">
    <meta name=viewport content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="<?php echo get_colored_header() ?>">
    <meta name="msapplication-TileColor" content="<?php echo get_colored_header() ?>">
    <meta name="msapplication-TileImage" content="<?php echo get_icon_url("msapplication-tile") ?>">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="<?php bloginfo('name') ?>">
    <meta name="application-name" content="<?php bloginfo('name') ?>">
    <link rel="apple-touch-icon" href="<?php echo get_icon_url("apple-touch-icon.png") ?>">
    <link rel="icon" type="image/png" href="<?php echo get_icon_url("favicon-64x64.png") ?>" sizes="64x64">
    <link rel="icon" type="image/png" href="<?php echo get_icon_url("favicon-48x48.png") ?>" sizes="48x48">
    <link rel="icon" type="image/png" href="<?php echo get_icon_url("favicon-32x32.png") ?>" sizes="32x32">
    <link rel="icon" type="image/png" href="<?php echo get_icon_url("favicon-16x16.png") ?>" sizes="16x16">
    <link rel="manifest" href="/manifest.json">
    <link rel="stylesheet" href="<?php bloginfo('template_url') ?>/css/style.css">
    <link rel="stylesheet" href="<?php bloginfo('template_url') ?>/css/loading.css">
  </head>
  <body>
    <nav>
      <section id="arrow-back">
        <a onclick="history.back()">
          <img alt="back" src="<?php bloginfo('template_url') ?>/images/nav/arrow-back.svg">
        </a>
      </section>
      <section id="brand">
        <a class="internal" href="/">
          <img alt="logo" src="<?php echo get_logo_url() ?>">
        </a>
      </section>
      <ul>
        <li id="home-button">
          <a class="internal" href="/">
            <img alt="home" src="<?php bloginfo('template_url') ?>/images/nav/home.svg">
            <span>Home</span>
          </a>
        </li>
        <li>
          <a class="internal" href="/categories">
            <img alt="categories" src="<?php bloginfo('template_url') ?>/images/nav/categories.svg">
            <span><?php _e('Categories','simple-pwa'); ?></span>
          </a>
        </li>
        <li>
          <a class="internal" href="/search">
            <img alt="search" src="<?php bloginfo('template_url') ?>/images/nav/search.svg">
            <span><?php _e('Search','simple-pwa'); ?></span>
          </a>
        </li>
        <li>
          <a class="internal" href="/tags">
            <img alt="tags" src="<?php bloginfo('template_url') ?>/images/nav/tags.svg">
            <span><?php _e('Tags','simple-pwa'); ?></span>
          </a>
        </li>
        <li>
          <a class="internal" href="/more">
            <img alt="more" src="<?php bloginfo('template_url') ?>/images/nav/more.svg">
            <span><?php _e('More','simple-pwa'); ?></span>
          </a>
        </li>
      </ul>
    </nav>

    <div id="loading"><div></div><div></div><div></div><div></div></div>

    <main id="container">
      <noscript>
      <?php _e('This site requires JavaScript.','simple-pwa'); ?>
      <a href="https://www.enable-javascript.com/" target="_blank"><?php _e('Here','simple-pwa'); ?></a>
      <?php _e('you can find how to enable it in your browser.','simple-pwa'); ?>
      </noscript>
    </main>

    <script defer src="<?php bloginfo('template_url') ?>/js/cache.js"></script>
    <script defer src="<?php bloginfo('template_url') ?>/js/content-provider.js"></script>
    <script defer src="<?php bloginfo('template_url') ?>/js/search.js"></script>
    <script defer src="<?php bloginfo('template_url') ?>/js/navigator.js"></script>
    <script defer src="<?php bloginfo('template_url') ?>/js/main.js"></script>
  </body>
</html>
