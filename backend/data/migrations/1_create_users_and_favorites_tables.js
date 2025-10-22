exports.up = function(knex) {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary();
      table.string('username').notNullable().unique();
      table.string('password').notNullable();
    })
    .createTable('favorite_movies', table => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.id');
      table.integer('movie_id').notNullable();
      table.string('title').notNullable();
      table.string('poster_path');
      table.decimal('vote_average');
      table.unique(['user_id', 'movie_id']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('favorite_movies')
    .dropTableIfExists('users');
};