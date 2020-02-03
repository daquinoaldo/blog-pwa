const apiUrl = typeof API_URL !== 'undefined' ? API_URL : "/"

/**
 * Make an HTTP GET request asynchronously.
 * @param url        Url of the request.
 * @param parseJSON  True for parse the JSON response (default = true).
 * @param retry      How many retries do in case of error (default = 1).
 * @returns {Promise<String>} Promise resolved with the result of the get request.
 */
function httpGetAsync(url, parseJSON = true, retry = 1) {
  return new Promise((resolve, reject) => {
    // inner function for recursion
    function httpGet(url, retry, parseJSON) {
      const xmlHttp = new XMLHttpRequest()
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
          try {
            resolve(parseJSON ? JSON.parse(xmlHttp.responseText) : xmlHttp)
          } catch (e) {
            reject("offline")
          }
      }
      xmlHttp.onerror = function() {
        if (retry) {
          console.warn("Cannot get url " + url + ". Retry.")
          httpGet(url, retry - 1, parseJSON)
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
  FIELDS_ALL: null,
  POST_FIELDS_DEFAULT: ["categories", "content", "date", "id", "slug", "tags", "title"],
  POST_ORDERBY_DEFAULT: "date",
  CATEGORY_FIELDS_DEFAULT: ["count", "description", "id", "name", "parent", "slug"],
  CATEGORY_ORDERBY_DEFAULT: "name"
}

/**
 * Order a list of items accordingly to the orderBy field.
 * @param item     List of item to be ordered.
 * @param orderBy  Field for the order.
 * @returns {Array<Object>} Ordered list.
 */
wp.order = function(items, orderBy) {
  return items.sort((a, b) => {
    if (!a[orderBy] || !b[orderBy]) return 0
    if (a[orderBy] < b[orderBy]) return -1
    if (a[orderBy] > b[orderBy]) return 1
    return 0
  })
}

/**
 * Given a post or a category, strips out the unwanted fields.
 * @param item    Post or the category object.
 * @param fields  Wanted fields, that will be kept.
 * @returns {Object} Filtered item.
 */
wp.filter = function(item, fields) {
  if (!fields) return item  // if null not filter
  for (let field in item)
    if (fields.indexOf(field) < 0) delete item[field]
    else if (item[field].hasOwnProperty("rendered"))
      item[field] = item[field].rendered
  return item
}

/**
 * Given a list of posts or categories, strips out the unwanted fields from each item.
 * @param item    Posts or the categories array.
 * @param fields  Wanted fields, that will be kept.
 * @returns {Array<Object>} List of filtered item.
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
 * Get posts list.
 * @param category    Id of the category of which retrieve posts.
 *                    If null all posts from all categories are retrieved.
 * @param tag         Id of the tag of which retrieve posts.
 *                    If null all posts from all tags are retrieved.
 * @param postNumber  Number of posts to get.
 * @param fields      Array of fields that we want in the posts.
 *                    For all the fields use wp.FIELDS_ALL.
 * @returns {Promise<Array<Object>>} Promise resolved with the list of all posts.
 */
wp.getPosts = function(category = null, tag = null, postsNumber = -1,
  orderBy = wp.POST_ORDERBY_DEFAULT, fields = wp.POST_FIELDS_DEFAULT) {
  return new Promise(async resolve => {
    // calculate number of pages and posts in last page
    if (postsNumber === -1) {
      url = apiUrl + "?rest_route=/wp/v2/posts&per_page=1"
      if (category) url += "&categories=" + category
      if (tag) url += "&tags=" + tag
      await httpGetAsync(url, false).then(res => postsNumber = res.getResponseHeader("x-wp-total"))
    }
    const pages = Math.ceil(postsNumber/wp.MAX_POST_PER_PAGE)
    // prepare the return value
    const allPosts = []
    const promises = []
    // iterate throw the pages
    for (let page = 1; page <= pages; page++) {
      // if only one page, query exactly that amount of posts
      perPage = pages > 1 ? wp.MAX_POST_PER_PAGE : postsNumber
      // prepare the url
      let url = apiUrl + "?rest_route=/wp/v2/posts&per_page=" + perPage + "&page=" + page
      if (category) url += "&categories=" + category
      if (tag) url += "&tags=" + tag
      // queue the job
      promises.push(httpGetAsync(url)
        .then(posts => allPosts.push(...wp.filterAll(posts, fields))))
    }
    // wait all the requests to end
    Promise.all(promises).then(() => resolve(wp.order(allPosts, orderBy)))
  })
}

/**
 * Get post by slug.
 * @param slug    Post slug.
 * @param fields  Array of fields that we want in the posts.
 *                For all the fields use wp.FIELDS_ALL.
 * @returns {Promise<Object>} Promise resolved with the post.
 */
wp.getPost = function(slug, fields = wp.POST_FIELDS_DEFAULT) {
  return httpGetAsync(apiUrl + "?rest_route=/wp/v2/posts&slug=" + slug)
      .then(post => wp.filter(post[0], fields))
}

/**
 * Get category list.
 * @param fields  Array of fields that we want in the categories.
 *                For all the fields use wp.FIELDS_ALL.
 * @returns {Promise<Array<Object>>} Promise resolved with the categories list.
 */
wp.getCategories = function(orderBy = wp.CATEGORY_ORDERBY_DEFAULT, fields = wp.CATEGORY_FIELDS_DEFAULT) {
  return httpGetAsync(apiUrl + "?rest_route=/wp/v2/categories")
    .then(categories => wp.order(wp.filterAll(categories, fields), orderBy))
}

/**
 * Get tags list.
 * @param fields  Array of fields that we want in the tags.
 *                For all the fields use wp.FIELDS_ALL.
 * @returns {Promise<Array<Object>>} Promise resolved with the tags list.
 */
wp.getTags = function(orderBy = wp.CATEGORY_ORDERBY_DEFAULT, fields = wp.FIELDS_ALL) {
  return httpGetAsync(apiUrl + "?rest_route=/wp/v2/tags")
    .then(tags => wp.order(wp.filterAll(tags, fields), orderBy))
}
