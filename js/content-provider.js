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
 * @returns {Promise<HTMLUListElementul>} List of posts.
 */
cp.posts = function(category) {
  return wp.getPosts(category).then(posts => {
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
