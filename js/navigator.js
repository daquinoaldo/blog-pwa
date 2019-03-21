const nav = {
  container: document.getElementById("container")
}

/**
 * Replace the container content with one specified.
 * @param content  DOM node with the new content.
 * @param title    Page title.
 */
nav.updatePage = function(content, title, scrollTop = 0) {
  // remove all children
  while (nav.container.firstChild)
  nav.container.removeChild(nav.container.firstChild)
  // append the new one
  if (title) document.title = title
  nav.container.appendChild(content)
  window.scrollTo(0, scrollTop)
  nav.setupInternal()
}

/**
* Override the behaviour of the elements with class "internal".
* This element are a element with the href field, but when clicked
* will not navigate to the link externally.
* Instead, the app content will be replaced by the load page function.
*/
nav.setupInternal = function() {
 let internalLinks = document.getElementsByClassName("internal")
 //const internalLinks = document.getElementsByTagName("a")
 for (let i = 0; i < internalLinks.length; i++)
  internalLinks[i].addEventListener("click", function (e) {
    e.preventDefault()
    const href = internalLinks[i].getAttribute("href")
    const scrollTop = document.getElementsByTagName("html")[0].scrollTop
    history.replaceState({ scrollTop: scrollTop }, "", window.location.href)
    history.pushState(null, "", href)
    nav.navigate(href)
  })
}

/**
 * Show the content specified in the URL.
 * @param url        URL of the content.
 * @param scrollTop  Distance in px from top (used when hit the back arrow)
 */
nav.navigate = function (url, scrollTop = 0) {
  if (url === "/" || url === "/posts")
    cp.posts().then(ul => nav.updatePage(ul, "Posts", scrollTop))
  else if (url.includes("/posts/")) {
    const slug = url.replace("/posts/", "")
    cp.post(slug).then(ul => nav.updatePage(ul, slug, scrollTop))
  }
  else if (url === "/categories")
    cp.categories().then(ul => nav.updatePage(ul, "Categories", scrollTop))
  else if (url.includes("/categories/")) {
    const category = url.replace("/categories/", "")
    cp.posts(category).then(ul => nav.updatePage(ul, category, scrollTop))
  }
  else return console.error("loadPage: invalid url " + url)
}

// Load current page when everything is load (otherwise js will missing)
document.addEventListener('readystatechange', event => {
  if (event.target.readyState === "complete") {
    nav.navigate(window.location.pathname)
  }
})

// Implement back action on history
window.onpopstate = e => 
  nav.navigate(window.location.pathname,
    e && e.state ? e.state.scrollTop : null)