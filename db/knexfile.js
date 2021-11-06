require('dotenv').config()

// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: process.env.psql_db,
      user: process.env.psql_user,
      password: process.env.psql_pass,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
