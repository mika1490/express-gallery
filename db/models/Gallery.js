const bookshelf = require(`./bookshelf`);
//if you create another table called posts must have the below line:
const User = require(`./User`)

//ES6
class Gallery extends bookshelf.Model {
get tableName() {return `gallery`}
get hasTimestamps() {return true}

user() {
return this.belongsTo(User, `user_id`);
 }
}

module.exports = Gallery;