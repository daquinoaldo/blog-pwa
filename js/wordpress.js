const API_URL = "https://your-wp-website.com/wp-json/wp/v2/"

/**
 * Make an HTTP GET request asynchronously.
 * @param url         The url of the request.
 * @param callback    Callback to be called.
 * @param retry       How many retries do in case of error (default = 1).
 * @param parseJSON   True for parse the JSON response (default = true).
 * @return The result of the get request.
 */
function httpGetAsync(url, parseJSON = true, retry = 1) {
  console.log(url)
  return new Promise(resolve => {
    // inner function for recursion
    function httpGet(url, retry, parseJSON) {
      const xmlHttp = new XMLHttpRequest()
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
          resolve(parseJSON ? JSON.parse(xmlHttp.responseText) : xmlHttp)
      }
      xmlHttp.onerror = function() {
        if (retry) {
          console.warn("Cannot get url " + url + ". Retry.")
          httpGet(url, callback, retry - 1)
        } else console.error("Cannot get url " + url)
      }
      xmlHttp.open("GET", url, true)
      xmlHttp.send(null)
    }
    httpGet(url, retry, parseJSON)
  })
}

/**
 * The wp object.
 * Includes all the constant and the functions to interact with WordPress.
 */
const wp = {
  MAX_POST_PER_PAGE: 100,
  POST_FIELDS_ALL: null,
  POST_FIELDS_DEFAULT: ["categories", "content", "date", "id", "slug", "tags", "title"],
  CATEGORY_FIELDS_ALL: null,
  CATEGORY_FIELDS_DEFAULT: ["count", "description", "id", "name", "parent", "slug"]
}

/**
 * Given a post or a category, strips out the unwanted fields.
 * @param item    The post or the category object.
 * @param fields  The wanted fields, that will be kept.
 * @return The filtered item.
 */
wp.filter = function(item, fields) {
  if (!fields) return item  // if null not filter
  for (let field in item)
    if (fields.indexOf(field) < 0) delete item[field]
  return item
}

/**
 * Given a list of posts or categories, strips out the unwanted fields from each item.
 * @param item    The posts or the categories array.
 * @param fields  The wanted fields, that will be kept.
 * @return The list of filtered item.
 */
wp.filterAll = function(items, fields) {
  if (!fields) return items
  // filter categories
  const filtered = []
  for (let i in items)
    filtered.push(wp.filter(items[i], fields))
  return filtered
}

/**
 * Get the posts list.
 * @param category    The category of which retrieve posts. If null all posts from all categories are retrieved.
 * @param postNumber  The number of posts to get.
 * @param postFields  An array of fields that we want in the posts. For all the fields use wp.POST_FIELDS_ALL.
 * @return A promise resolved with the list of all posts.
 */
wp.getPosts = function(category = null, postsNumber = -1, postFields = wp.POST_FIELDS_DEFAULT) {
  return new Promise(async resolve => {
    // calculate number of pages and posts in last page
    if (postsNumber == -1) {
      url = API_URL + "posts/?per_page=1"
      if (category) url += "&categories=" + category
      await httpGetAsync(url, false).then(res => postsNumber = res.getResponseHeader("x-wp-total"))
    }
    let pages = Math.ceil(postsNumber/wp.MAX_POST_PER_PAGE)
    let postInLastPage = postsNumber % wp.MAX_POST_PER_PAGE || 100
    // prepare the return value
    let allPosts = []
    let promises = []
    // iterate throw the pages
    for (let page = 1; page <= pages; page++) {
      // prepare the url
      perPage = page == pages ? postInLastPage : wp.MAX_POST_PER_PAGE
      let url = API_URL + "posts/?per_page=" + perPage + "&page=" + page
      if (category) url += "&category_name=" + category
      // queue the job
      promises.push(httpGetAsync(url)
        .then(posts => allPosts.push(...wp.filterAll(posts, postFields))))
    }
    // wait all the requests to end
    Promise.all(promises).then(() => resolve(allPosts))
  })
}

/**
 * Get post by slug.
 * @param slug        The post slug.
 * @param postFields  An array of fields that we want in the posts. For all the fields use wp.POST_FIELDS_ALL.
 * @return A promise resolved with the post.
 */
wp.getPost = function(slug, postFields = wp.POST_FIELDS_DEFAULT) {
  return new Promise(resolve => httpGetAsync(API_URL + "posts?slug=" + slug)
      .then(post => resolve(wp.filter(post[0], postFields))))
}

wp.getCategories = function(categoryFields = wp.CATEGORY_FIELDS_DEFAULT) {
  return new Promise(resolve => httpGetAsync(API_URL + "categories")
    .then(categories => resolve(wp.filterAll(categories, categoryFields))))
}