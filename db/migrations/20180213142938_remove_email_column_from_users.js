
exports.up = function(knex, Promise) {
  return knex.schema.table(`users`, (table) => {
    table.dropUnique(`email`)
    table.dropColumn(`email`)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table(`users`, table => {
    table.string(`email`).unique().notNullable();
  })
};
