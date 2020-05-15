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
      ul.appendChild(cp.createListElement("/" + posts[i].slug, posts[i].title))
    return ul
  }

  async categories() {
    const categories = await this.cache.getAll("categories")
    const ul = document.createElement("ul")
    ul.className = "list"
    for (let category of categories)
      ul.appendChild(cp.createListElement(`/categories/${category.slug}`, category.name))
    return ul
  }

  async tags() {
    const tags = await this.cache.getAll("tags")
    const ul = document.createElement("ul")
    ul.className = "list"
    for (let tag of tags)
      ul.appendChild(cp.createListElement(`/tags/${tag.slug}`, tag.name))
    return ul
  }

  async post(slug) {
    console.log(slug)
    const post = await this.cache.get("posts", slug)
    const div = document.createElement("div")
    div.className = "content"
    div.innerHTML = post.content
    return div
  }

  more() {
    // Container
    const div = document.createElement("div")
    div.className = "content"
    // About app
    const t1 = document.createElement("h2")
    t1.appendChild(document.createTextNode("Blog PWA"))
    div.appendChild(t1)
    const p1 = document.createElement("p")
    p1.appendChild(document.createTextNode("This is a skeleton for a Progressive Web Application."))
    div.appendChild(p1)
    const p2 = document.createElement("p")
    p2.appendChild(document.createTextNode("You can fork or clone it on "))
    repo = document.createElement("a")
    repo.href = "https://github.com/daquinoaldo/blog-pwa"
    repo.target = "_blank"
    repo.appendChild(document.createTextNode("GitHub"))
    p2.appendChild(repo)
    p2.appendChild(document.createTextNode("."))
    div.appendChild(p2)
    // About me
    const t2 = document.createElement("h2")
    t2.appendChild(document.createTextNode("About me"))
    div.appendChild(t2)
    const p3 = document.createElement("p")
    p3.appendChild(document.createTextNode("Hi! I'm Aldo D'Aquino."))
    p3.appendChild(document.createElement("br"))
    p3.appendChild(document.createTextNode("I’m a master degree student at Pisa University."))
    div.appendChild(p3)
    const p4 = document.createElement("p")
    p4.appendChild(document.createTextNode("I program web applications for pleasure, I’m very good with Node.js and Docker."))
    div.appendChild(p4)
    const p5 = document.createElement("p")
    p5.appendChild(document.createTextNode("I like finding out new things, trying new languages and discovering new technologies. I’ve participated to many hackathons and in my free time I like working on some open source projects."))
    div.appendChild(p5)
    const p6 = document.createElement("p")
    p6.appendChild(document.createTextNode("Currently I’m interested in Progressive Web Applications, Python and Go."))
    div.appendChild(p6)
    // Bio link
    const p8 = document.createElement("p")
    p8.appendChild(document.createTextNode("You can find me on "))
    gh = document.createElement("a")
    gh.href = "https://github.com/daquinoaldo"
    gh.target = "_blank"
    gh.appendChild(document.createTextNode("GitHub"))
    p8.appendChild(gh)
    p8.appendChild(document.createTextNode(" and at "))
    website = document.createElement("a")
    website.href = "https://ald.ooo"
    website.target = "_blank"
    website.appendChild(document.createTextNode("ald.ooo"))
    p8.appendChild(website)
    p8.appendChild(document.createTextNode("."))
    div.appendChild(p8)
    return div
  }

}