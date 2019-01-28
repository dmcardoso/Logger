exports.up = function (knex, Promise) {
    return knex.schema.createTable('projects', table => {
        table.increments('id').primary();
        table.text('name');
        table.text('path_error');
        table.text('path_debug');
        table.datetime('created_at');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('projects');
};
