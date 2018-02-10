const bookshelf = require(`./bookshelf`);
//if you create another table called posts must have the below line:
// const Post = require(`./Post`)

//ES6
class Gallery extends bookshelf.Model {
get tableName() {return `gallery`}
get hasTimestamps() {return true}

// posts() {
// return this.hasMany(Post, `author_id`);
//  }
}

module.exports = Gallery;