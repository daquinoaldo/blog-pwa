const nav = {
  isLoading: false,
  container: document.getElementById("container"),
  arrowBack: document.getElementById("arrow-back"),
  loading: document.getElementById("loading")
}

/**
 * Empty the container from every content.
 */
nav.emptyContent = function () {
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
 */
nav.setContent = function (content, scrollTop = 0) {
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
nav.setupInternal = function () {
  let internalLinks = document.getElementsByClassName("internal")
  //const internalLinks = document.getElementsByTagName("a")
  for (let i = 0; i < internalLinks.length; i++)
    internalLinks[i].onclick = e => {
      e.preventDefault()
      const title = internalLinks[i].textContent
      const href = internalLinks[i].getAttribute("href")
      const scrollTop = document.getElementsByTagName("html")[0].scrollTop
      const pageTitle = document.title
      const state = { scrollTop: scrollTop, title: pageTitle }
      history.replaceState(state, "", window.location.href)
      history.pushState(null, "", href)
      nav.navigate(href, title)
    }
}

/**
 * Toggle the back arrow button and the loading spinner.
 */
nav.show = elem => elem.style.display = "block"
nav.hide = elem => elem.style.display = "none"

/**
 * Show the content specified in the URL.
 * @param url        URL of the content.
 * @param scrollTop  Distance in px from top (used when hit the back arrow)
 */
nav.navigate = function (url, title, scrollTop = 0) {
  // prevent multiple loading of the same resource
  if (nav.isLoading) return
  nav.isLoading = true
  // set page title
  document.title = (title || "") + (title && nav.siteTitle ? " | " : "") + nav.siteTitle
  // empty the page, then load and set the new content
  nav.emptyContent()
  if (url === "/")
    cp.posts().then(content => nav.setContent(content, scrollTop))
  else if (url === "/categories")
    cp.categories().then(content => nav.setContent(content, scrollTop))
  else if (url.includes("/categories/")) {
    const category = url.replace("/categories/", "")
    cp.posts(category).then(content => nav.setContent(content, scrollTop))
  }
  else if (url === "/tags")
    cp.tags().then(content => nav.setContent(content, scrollTop))
  else if (url.includes("/tags/")) {
    const tag = url.replace("/tags/", "")
    cp.posts(undefined, tag).then(content => nav.setContent(content, scrollTop))
  }
  else if (url === "/search") {
    nav.setContent(search.getContent(), scrollTop)
    search.input.focus()
  }
  else if (url === "/more")
    nav.setContent(cp.more(), scrollTop)
  else { // it's a post
    const slug = url
    cp.post(slug).then(content => nav.setContent(content, slug, scrollTop))
    nav.show(nav.arrowBack)  // show the back arrow button
  }
}

// Load current page when everything is load (otherwise js will missing)
document.addEventListener('readystatechange', e => {
  if (e.target.readyState === "complete") {
    nav.siteTitle = document.title
    nav.navigate(window.location.pathname)
  }
})

// Implement back action on history
window.onpopstate = e =>
  nav.navigate(
    window.location.pathname,
    e && e.state ? e.state.title : null,
    e && e.state ? e.state.scrollTop : null
  )