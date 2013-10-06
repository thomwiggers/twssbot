var fs = require("fs")

console.log("Reading positive dataset");
exports.data = fs.readFileSync("data/positive_data").toString().split(/\n/);


