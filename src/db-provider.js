'use strict';

const { Pool } = require('pg');

const PG_RUNTIME_PASSWORD = process.env.PG_RUNTIME_PASSWORD;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'kpi_rozklad',
  user: 'runtime',
  password: PG_RUNTIME_PASSWORD
});

const db = new Proxy({}, {
  get(target, name) {
    return async (...args) => {
      let query = `SELECT ${name}(`;
      args.slice(0, -1).forEach((arg, index) => query += `$${index + 1}, `);
      query += `$${args.length});`;
      console.log(query);
      console.log(args);
      try {
        const result = await pool.query(query, args);
      } catch(e) {
        // TODO: FATAL
        console.log(e);
      }
      return result;
    } 
  }
})

module.exports = db;
