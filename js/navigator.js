const nav = {
  isLoading:false,
  container: document.getElementById("container"),
  arrowBack: document.getElementById("arrow-back"),
  loading: document.getElementById("loading")
}

/**
 * Empty the container from every content.
 */
nav.emptyContent = function() {
  // show the loading panel, will stop in setContent()
  nav.show(nav.loading)
  // remove all children
  while (nav.container.firstChild)
  nav.container.removeChild(nav.container.firstChild)
  // reset the back arrow button
  nav.hide(nav.arrowBack)
}

/**
 * Set the specified content inside the container.
 * @param content  DOM node with the new content.
 * @param title    Page title.
 */
nav.setContent = function(content, title, scrollTop = 0) {
  // append the new one
  if (title) document.title = title
  nav.container.appendChild(content)
  window.scrollTo(0, scrollTop)
  nav.setupInternal()
  nav.hide(nav.loading)  // page ready, hide the loading panel
  nav.isLoading = false
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
  internalLinks[i].onclick = e => {
    e.preventDefault()
    const href = internalLinks[i].getAttribute("href")
    const scrollTop = document.getElementsByTagName("html")[0].scrollTop
    history.replaceState({ scrollTop: scrollTop }, "", window.location.href)
    history.pushState(null, "", href)
    nav.navigate(href)
  }
}

/**
 * Toogle the back arrow button and the loading spinner.
 */
nav.show = elem => elem.style.display = "block"
nav.hide = elem => elem.style.display = "none"

/**
 * Show the content specified in the URL.
 * @param url        URL of the content.
 * @param scrollTop  Distance in px from top (used when hit the back arrow)
 */
nav.navigate = function (url, scrollTop = 0) {
  if (nav.isLoading) return  // prevent multiple loading of the same resource
  nav.isLoading = true
  nav.emptyContent()
  if (url === "/" || url === "/posts")
    cp.posts().then(ul => nav.setContent(ul, "Posts", scrollTop))
  else if (url.includes("/posts/")) {
    const slug = url.replace("/posts/", "")
    cp.post(slug).then(ul => nav.setContent(ul, slug, scrollTop))
    nav.show(nav.arrowBack)  // show the back arrow button
  }
  else if (url === "/categories")
    cp.categories().then(ul => nav.setContent(ul, "Categories", scrollTop))
  else if (url.includes("/categories/")) {
    const category = url.replace("/categories/", "")
    cp.posts(category).then(ul => nav.setContent(ul, category, scrollTop))
  }
  else if (url === "/tags")
    cp.tags().then(ul => nav.setContent(ul, "Tags", scrollTop))
  else if (url.includes("/tags/")) {
    const tag = url.replace("/tags/", "")
    cp.posts(undefined, tag).then(ul => nav.setContent(ul, tag, scrollTop))
  }
  else if (url === "/search") {
    nav.setContent(search.getContent(), "Search", scrollTop)
    search.input.focus()
  }
  else if (url === "/more")
    nav.setContent(cp.more(), "More", scrollTop)
  else return console.error("loadPage: invalid url " + url)
}

// Load current page when everything is load (otherwise js will missing)
document.addEventListener('readystatechange', e => {
  if (e.target.readyState === "complete") {
    nav.navigate(window.location.pathname)
  }
})

// Implement back action on history
window.onpopstate = e => 
nav.navigate(window.location.pathname,
    e && e.state ? e.state.scrollTop : null)