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
    for (let i = 0; i < posts.length; i++)
      ul.appendChild(this.createListElement("/" + posts[i].slug, posts[i].title))
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

  async post(slug) {
    const post = await this.cache.get("posts", slug)
    const div = document.createElement("div")
    div.className = "content"
    div.innerHTML = post.content
    return div
  }

  more() {
    const repo = document.createElement("a")
    repo.href = "https://github.com/daquinoaldo/blog-pwa"
    repo.target = "_blank"
    repo.appendChild(document.createTextNode("Simple PWA"))
    const website = document.createElement("a")
    website.href = "https://ald.ooo"
    website.target = "_blank"
    website.appendChild(document.createTextNode("Aldo D'Aquino"))
    const p = document.createElement("p")
    p.id = "copyright"
    p.appendChild(repo)
    p.appendChild(document.createTextNode(" by "))
    p.appendChild(website)
    const div = document.createElement("div")
    div.className = "content"
    div.appendChild(document.createElement("br"))
    div.appendChild(p)
    return div
  }

}