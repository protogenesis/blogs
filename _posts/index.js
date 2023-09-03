const fs = require("fs");
const path = require("path");

const dir = "D:/workSpace/jekyll-TeXt-theme/_posts";
const files = fs.readdirSync(dir);

files.forEach((file) => {
  fs.renameSync(
    path.join(dir, file),
    path.join(dir, `2021-06-05-${file.replace(/_/g, " ")}`)
  );
});
console.log(files);
