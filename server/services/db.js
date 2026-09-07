const database = require("nedb-promises");

const users = database.create({ filename: './users.db', autoload: true });

module.exports = { users };