const { resolve, dirname } = require("path");

const Banks = resolve(dirname(require.main.filename) + "/db/Banks.json");
const Users = resolve(dirname(require.main.filename) + "/db/Users.json");

module.exports = {
    Banks,
    Users
}