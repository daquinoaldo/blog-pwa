# Blog PWA
_Create a PWA for your blog without any changes to WordPress_

![pwa](https://user-images.githubusercontent.com/3104648/28351989-7f68389e-6c4b-11e7-9bf2-e9fcd4977e7a.png)

### Install
1. You need a WordPress blog. Other CMS can work with this PWA with some changes,
   them must expose WordPress-like REST APIs.

2. Populate your blog with some posts. Divide posts into categories, since tags are not yet supported.

3. [Download](https://github.com/daquinoaldo/blog-wpa/archive/master.zip) this repository
   and upload the entire content of the zip on an Apache server.
   Your blog's server is fine, but pay attention to the WordPress url scheme.
   I suggest you a subdomain.

4. Edit the `API_URL` in [js/app.js](js/app.js) to mach your blog domain.


### Additional requirements
PWA works only on https connections. Furthermore, http2 is strongly suggested.
- You can ask your hosting provider (noobie way).
- You can obtain for free using [Cloudflare](https://www.cloudflare.com) (easy for most users).

Bonus: you can use [https-localhost](https://github.com/daquinoaldo/https-localhost)
       for testing on localhost (intermediate level).

### Need help?
Contact me! I'll be happy to help you! 😊
