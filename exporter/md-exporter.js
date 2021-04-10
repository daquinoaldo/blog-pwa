const fs = require("fs")
const fetch = require("node-fetch")

const WP_ROOT = "http://localhost:8080"

// print articles
fetch(`${WP_ROOT}/?rest_route=/simple-pwa/v1/export`)
  .then(res => res.json())
  .then(articles => {
    for (const article of articles)
      fs.writeFileSync(
        `output/articles/${article.slug}.md`,
        `---\n` +
        `title: ${article.title}\n` +
        `categories:\n` +
        article.categories.filter(category => category != "canti").map(category => `  - ${category}\n`).join("") +
        `type: chords\n` +
        `---\n` +
        article.content
          .replaceAll("&nbsp;", "")
          .replaceAll("\n", "\\\n")
          .replaceAll("[", "{")
          .replaceAll("]", "}")
          .replaceAll(" ", "")
          .replaceAll("  ", "")
          .replaceAll(" \\", "\\")
          .replaceAll("\\\n\\\n", "\n\n") +
        `\n`
      )
  })

fetch(`${WP_ROOT}/?rest_route=/simple-pwa/v1/categories`)
  .then(res => res.json())
  .then(categories => {
    for (const category of categories)
      if (category.slug != "canti" && category.slug != "uncategorized")
        fs.writeFileSync(
          `output/categories/${category.slug}.yml`,
          `title: ${category.name}\n`
        )
  })
