var fs = require("fs")

console.log("Reading negative dataset");
exports.data = fs.readFileSync("data/negative_data").toString().split(/\n/);


