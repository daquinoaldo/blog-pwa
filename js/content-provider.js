class ContentProvider {

  cache = new Cache()

  createListElement(link, name) {
    const li = document.createElement("li")
    const a = document.createElement("a")
    a.className = "internal"
    a.href = link
    a.innerHTML = name
    li.appendChild(a)
    return li
  }

  async posts(category, tag) {
    // get and optionally filter the posts
    let posts = await this.cache.getAll("posts")
    if (category) posts = posts.filter(post => post.categories.includes(category))
    if (tag) posts = posts.filter(post => post.tags.includes(tag))
    // create ul element
    const ul = document.createElement("ul")
    ul.className = "list"
    for (let post of posts)
      ul.appendChild(this.createListElement(`/${post.slug}`, post.title))
    return ul
  }

  async categories() {
    const categories = await this.cache.getAll("categories")
    const ul = document.createElement("ul")
    ul.className = "list"
    for (let category of categories)
      ul.appendChild(this.createListElement(`/categories/${category.slug}`, category.name))
    return ul
  }

  async tags() {
    const tags = await this.cache.getAll("tags")
    const ul = document.createElement("ul")
    ul.className = "list"
    for (let tag of tags)
      ul.appendChild(this.createListElement(`/tags/${tag.slug}`, tag.name))
    return ul
  }

  async pages() {
    const pages = await this.cache.getAll("pages")
    const ul = document.createElement("ul")
    ul.className = "list"
    for (let page of pages)
      ul.appendChild(this.createListElement(`/${page.slug}`, page.title))
    return ul
  }

  async post(slug) {
    const post = await this.cache.get("posts", slug) || await this.cache.get("pages", slug)
    const h1 = document.createElement("h1")
    h1.innerText = post.title
    const div = document.createElement("div")
    div.className = "content"
    div.innerHTML = post.content
    div.prepend(h1)
    return div
  }

  copyright() {
    const wordpress = document.createElement("a")
    wordpress.href = "https://wordpress.org/"
    wordpress.target = "_blank"
    wordpress.appendChild(document.createTextNode("Wordpress"))
    const repo = document.createElement("a")
    repo.href = "https://github.com/daquinoaldo/blog-pwa"
    repo.target = "_blank"
    repo.appendChild(document.createTextNode("Simple PWA"))
    const p = document.createElement("p")
    p.id = "copyright"
    p.appendChild(document.createTextNode("Powered by "))
    p.appendChild(wordpress)
    p.appendChild(document.createTextNode(" and "))
    p.appendChild(repo)
    return p
  }

  async more() {
    const div = document.createElement("div")
    div.className = "content"
    div.appendChild(await this.pages())
    div.appendChild(document.createElement("br"))
    div.appendChild(this.copyright())
    return div
  }

}
