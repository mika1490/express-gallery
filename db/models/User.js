const bookshelf = require(`./bookshelf`);
//if you create another table called posts must have the below line:
const Gallery = require(`./Gallery`)

//ES6
class User extends bookshelf.Model {
get tableName() {return `users`}
get hasTimestamps() {return true}

gallery() {
return this.hasMany(Gallery, `user_id`);
 }
}

module.exports = User;