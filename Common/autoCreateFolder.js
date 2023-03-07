const fs = require("fs");

module.exports = (folder) => {
  const isExistFolder = fs.existsSync(folder);
  if (!isExistFolder) {
    fs.mkdirSync(folder, { recursive: true });
  }
};
