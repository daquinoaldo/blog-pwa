const cp = {}

/**
 * Create a list element li.
 * @param link  href of the link.
 * @param name  Text of the element.
 * @returns {HTMLLIElement} li element.
 */
cp.createListElement = function(link, name) {
  const li = document.createElement("li")
  const a = document.createElement("a")
  a.className = "internal"
  a.href = link
  a.innerHTML = name
  li.appendChild(a)
  return li
}

/**
 * Prepare a list (ul) with all the posts.
 * @param category  Category of the posts. If null, all the categories.
 * @param tag       Tag of the posts. If null, all the tags.
 * @returns {Promise<HTMLUListElementul>} List of posts.
 */
cp.posts = function(category, tag) {
  return wp.getPosts(category, tag, undefined, "title").then(posts => {
    const ul = document.createElement("ul")
    ul.className = "list"
    for (let i = 0; i < posts.length; i++)
      ul.appendChild(cp.createListElement("/posts/" + posts[i].slug, posts[i].title))
    return ul
  })
}

/**
 * Prepare a list (ul) with all the categories.
 * @returns {Promise<HTMLUListElementul>} List of categories.
 */
cp.categories = function() {
  return wp.getCategories().then(categories => {
    const ul = document.createElement("ul")
    ul.className = "list"
    for (let i = 0; i < categories.length; i++)
      ul.appendChild(cp.createListElement("/categories/" + categories[i].id, categories[i].name))
    return ul
  })
}

/**
 * Prepare a list (ul) with all the tags.
 * @returns {Promise<HTMLUListElementul>} List of tags.
 */
cp.tags = function() {
  return wp.getTags().then(tags => {
    const ul = document.createElement("ul")
    ul.className = "list"
    for (let i = 0; i < tags.length; i++)
      ul.appendChild(cp.createListElement("/tags/" + tags[i].id, tags[i].name))
    return ul
  })
}

/**
 * Prepare a list (ul) with all the posts.
 * @param slug  Slug of the post.
 * @returns {Promise<HTMLUListElementul>} List of posts.
 */
cp.post = function(slug) {
  return wp.getPost(slug).then(post => {
    const div = document.createElement("div")
    div.className = "content"
    div.innerHTML = post.content
    return div
  })
}

cp.more = function() {
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
  website.href = "https://aldodaquino.com"
  website.target = "_blank"
  website.appendChild(document.createTextNode("aldodaquino.com"))
  p8.appendChild(website)
  p8.appendChild(document.createTextNode("."))
  div.appendChild(p8)
  return div
}
