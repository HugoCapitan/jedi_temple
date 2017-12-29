const Slugify = require('slugify')

const slugify = (name) => {
  return Slug(name, {
    replacement: '_',
    lower: true
  });
}

const howManyKeys = (obj) => {
  return Object.keys(obj).length
}

module.exports = { slugify, howManyKeys }
