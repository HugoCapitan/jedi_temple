const Slugify = require('slugify')

const slugify = (name) => {
  return Slug(name, {
    replacement: '_',
    lower: true
  });
}

module.exports = { slugify }
