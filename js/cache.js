class Cache {

  api_endpoint = "/?rest_route=/simple-pwa/v1"
  collections = ["posts", "categories", "tags"]

  async cacheAll() {
    localStorage.setItem("last-edit", await this.getLastEdit())
    await Promise.all(
      this.collections.map(collection =>
        fetch(`${this.api_endpoint}/${collection}`)
          .then(res => res.json())
          .then(items => this.putAll(collection, items))
      )
    )
    console.log("Cache update. Ready to go offline.")
  }

  async getLastEdit() {
    return fetch(`${this.api_endpoint}/last-edit`)
      .then(res => res.json())
  }

  async checkForUpdates() {
    if (await this.getLastEdit() > localStorage.getItem("last-edit"))
      return this.cacheAll
  }

  async connect() {
    return new Promise((resolve, reject) => {
      // If already opened, return
      if (this.db) resolve()
      // Open db
      const request = indexedDB.open("simple-pwa")
      request.onerror = event => reject("Access denied to database")
      request.onsuccess = event => {
        this.db = event.target.result
        this.db.onerror = event => console.error("Database error: ", event.target.error)
        resolve()
      }
      // create collections
      request.onupgradeneeded = event => {
        this.db = event.target.result
        for (let collection of this.collections)
          if (!this.db.objectStoreNames.contains(collection))
            this.db.createObjectStore(collection)
      }
    })
  }

  async putAll(collection, items) {
    await this.connect()
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([collection], "readwrite")
      items.forEach(item => tx.objectStore(collection).put(item, item.slug))
      tx.oncomplete = event => resolve(event.target.result)
      tx.onerror = event => reject(event.target.error)
    })
  }

  async get(collection, key) {
    await this.connect()
    return new Promise((resolve, reject) => {
      const request = this.db.transaction([collection], "readwrite")
        .objectStore(collection)
        .get(key)
      request.onsuccess = event => resolve(event.target.result)
      request.onerror = event => reject(event.target.error)
    })
  }

  async getAll(collection) {
    await this.connect()
    return new Promise((resolve, reject) => {
      const request = this.db.transaction([collection], "readwrite")
        .objectStore(collection)
        .getAll()
      request.onsuccess = event => resolve(event.target.result)
      request.onerror = event => reject(event.target.error)
    })
  }

  async clear(collection, key) {
    await this.connect()
    return new Promise((resolve, reject) => {
      const request = this.db.transaction([collection], "readwrite")
        .objectStore(collection)
        .clear()
      request.onsuccess = event => resolve(event.target.result)
      request.onerror = event => reject(event.target.error)
    })
  }

}