class Search {

  cache = new Cache()
  posts = null
  ul = null

  constructor() {
    // input box
    this.input = document.createElement("input")
    this.input.type = "search"
    this.input.id = "search"
    this.input.placeholder = "Search..."
    this.input.autocomplete = "off"
    this.input.oninput = () => this.filter(this.input.value)
    // main container
    this.div = document.createElement("div")
    this.div.appendChild(this.input)
  }

  async getContent() {
    this.input.value = ""
    this.posts = await this.cache.getAll("posts")
    this.filter(this.input.value)
    return this.div
  }

  setList(posts) {
    // prepare new list
    const ul = document.createElement("ul")
    ul.className = "list"
    for (let post of posts)
      ul.appendChild(cp.createListElement("/posts/" + post.slug, post.title))
    // remove previous items
    if (this.ul)
      this.div.removeChild(this.ul)
    // prepare add new list
    this.div.appendChild(ul)
    this.ul = ul
  }

  filter(input) {
    if (!input) return this.setList(this.posts) // no search term ==> all posts
    input = input.toLowerCase()
    // puts first the posts who's title starts with, then those that includes the input in the title
    // and finally the ones that contains the search term in the content
    const titleStartWith = this.posts.filter(post => post.title.toLowerCase().indexOf(input) === 0)
    const titleIncludes = this.posts.filter(post => post.title.toLowerCase().includes(input))
    const contentIncludes = this.posts.filter(post => post.content.toLowerCase().includes(input))
    // merge them without duplicates
    const filtered = titleStartWith
    for (let post of titleIncludes)
      if (filtered.indexOf(post) < 0)
        filtered.push(post)
    for (let post of contentIncludes)
      if (filtered.indexOf(post) < 0)
        filtered.push(post)
    this.setList(filtered)
  }

}