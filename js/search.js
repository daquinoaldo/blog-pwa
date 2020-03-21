const search = {
  posts: null,
  div: document.createElement("div"),
  ul: null
}

// search input
search.input = document.createElement("input")
search.input.type = "search"
search.input.id = "search"
search.input.placeholder = "Search..."
search.input.oninput = () => search.filter(search.input.value)
search.div.appendChild(search.input)

/**
 * Prepare the content for te navigator.
 * @returns {HTMLDivElement} Content for the navigator.
 */
search.getContent = function() {
  search.input.value = ""
  wp.getPosts(undefined, undefined, undefined, "title").then(posts => {
    search.posts = posts
    search.filter(search.input.value)
  })
  return search.div
}

/**
 * Set the list of items that matches the query.
 * @param ul List of item to be set as content.
 */
search.setList = function(ul) {
  if (search.ul)
    search.div.removeChild(search.ul)
  search.div.appendChild(ul)
  search.ul = ul
}

search.setList = function(posts) {
  // prepare new list
  const ul = document.createElement("ul")
  ul.className = "list"
  for (let i = 0; i < posts.length; i++)
    ul.appendChild(cp.createListElement("/posts/" + posts[i].slug, posts[i].title))
  // remove previous items
  if (search.ul)
    search.div.removeChild(search.ul)
  // prepare add new list
  search.div.appendChild(ul)
  search.ul = ul
}

/**
 * Filters posts according to the input value.
 * @param input Input of the search box.
 * @returns {HTMLUListElement} List of item that matches the query.
 */
search.filter = async function(input) {
  if (!search.posts) return  // loading posts
  if (!input) return search.setList(search.posts) // all posts
  // else filter
  input = input.toLowerCase()
  const filtered = []
  // first filter by title
  for (let i = 0; i < search.posts.length; i++)
    if (search.posts[i].title.toLowerCase().includes(input))
      filtered.push(search.posts[i])
  // then by content
  for (let i = 0; i < search.posts.length; i++)
    if (search.posts[i].content.toLowerCase().includes(input) &&
    filtered.indexOf(search.posts[i]) < 0)
      filtered.push(search.posts[i])
  search.setList(filtered)
}