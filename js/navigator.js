class Navigator {

  cp = new ContentProvider()

  isLoading = false

  container = document.getElementById("container")
  arrowBack = document.getElementById("arrow-back")
  loading = document.getElementById("loading")

  constructor() {
    // load current page when everything is load (otherwise js will missing)
    document.addEventListener('readystatechange', async e => {
      if (e.target.readyState === "complete") {
        // save the site title
        this.siteTitle = document.title
        // navigate to the page
        await this.navigate()
        // hide the arrow (since we don't came from inside the application)
        this.hide(this.arrowBack)
      }
    })
    // implement back action on history
    window.onpopstate = e => this.navigate(e?.state?.title, e?.state?.scrollTop)
  }

  // toggle display property of elements
  show = elem => elem.style.display = "block"
  hide = elem => elem.style.display = "none"

  // clear the content
  emptyContent() {
    // show the loading panel, will stop in setContent()
    this.show(this.loading)
    // remove all children
    while (this.container.firstChild)
      this.container.removeChild(this.container.firstChild)
    // reset the back arrow button (i.e. hide it)
    this.hide(this.arrowBack)
  }

  // setup .internal links to be handled by this navigator instead of firing a page load
  setupInternal() {
    const internalLinks = document.getElementsByClassName("internal")
    for (let link of internalLinks)
      link.onclick = e => {
        e.preventDefault()
        // save the current page and scroll in the history
        const state = {
          scrollTop: document.getElementsByTagName("html")[0].scrollTop,
          title: document.title
        }
        // add the current page to the history
        history.replaceState(state, "", window.location.href)
        // move to the new page
        history.pushState(null, link.textContent, link.href)
        // navigate to the new page
        this.navigate(link.textContent)
      }
  }

  // if the content contains script tags, evaluate them
  evaluateScripts() {
    const scripts = this.container.getElementsByTagName("script")
    for (let script of scripts) {
      if (script.text && script.text != "")
        eval(script.text)
      if (script.src && script.src != "") {
        fetch(script.src)
          .then(res => res.text())
          .then(content => eval(content))
      }
    }
  }

  // set a new content
  setContent(content, scrollTop = 0) {
    this.container.appendChild(content)
    window.scrollTo(0, scrollTop)
    this.setupInternal()     // setup internal links
    this.hide(this.loading)  // page ready, hide the loading panel
    this.isLoading = false   // exit from loading state
  }

  // navigate, i.e. prepare and set the content basing on the url
  async navigate(title, scrollTop = 0) {
    // prevent multiple loading of the same resource
    if (this.isLoading) return
    this.isLoading = true
    // set page title
    document.title = (title || "") + (title && this.siteTitle ? " | " : "") + this.siteTitle
    // empty the page
    this.emptyContent()
    // load and set the new content
    const url = window.location.pathname
    if (url === "/") {
      const content = await this.cp.posts()
      this.setContent(content, scrollTop)
    }
    else if (url === "/categories") {
      const content = await this.cp.categories()
      this.setContent(content, scrollTop)
    }
    else if (url.includes("/categories/")) {
      const category = url.replace("/categories/", "")
      const content = await this.cp.posts(category)
      this.show(this.arrowBack)
      this.setContent(content, scrollTop)
    }
    else if (url === "/tags") {
      const content = await this.cp.tags()
      this.setContent(content, scrollTop)
    }
    else if (url.includes("/tags/")) {
      const tag = url.replace("/tags/", "")
      const content = await this.cp.posts(undefined, tag)
      this.setContent(content, scrollTop)
    }
    else if (url === "/search") {
      const search = new Search()
      const content = await search.getContent()
      this.setContent(content, scrollTop)
      search.input.focus()
    }
    else if (url === "/more") {
      const content = this.cp.more()
      this.setContent(content, scrollTop)
    }
    else { // it's a post
      const slug = url.replace(/\//g, "")
      const content = await this.cp.post(slug)
      this.show(this.arrowBack)
      this.setContent(content, scrollTop)
    }
    this.evaluateScripts()
  }
}