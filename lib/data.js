let fs = require("fs");
let path = require("path");

let lib = {};

lib.baseDir = path.join(__dirname, "/../.data/");

lib.create = (dir, file, data, callback) => {
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        let stringData = JSON.stringify(data);

        fs.writeFile(fileDescriptor, stringData, err => {
          if (!err) {
            fs.close(fileDescriptor, err => {
              if (!err) {
                callback(false);
              } else {
                callback("Error closing new files");
              }
            });
          } else {
            callback("Error writing to new file");
          }
        });
      } else {
        callback("Could not create new file, it might already exist");
      }
    }
  );
};

lib.read = (dir, file, callback) => {
  fs.readFile(lib.baseDir + dir + "/" + file + ".json", "utf8", (err, data) => {
    if (!err && data) {
      let parsedData = helpers.parseJSONToObject(data);
      callback(false, parsedData);
    } else callback(err, data);
  });
};

lib.update = (dir, file, data, callback) => {
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        let stringData = JSON.stringify(data);

        fs.truncate(fileDescriptor, err => {
          if (!err) {
            fs.writeFile(fileDescriptor, stringData, err => {
              if (!err) {
                fs.close(fileDescriptor, err => {
                  if (!err) {
                    callback(false);
                  } else {
                    callback("Error closing the file");
                  }
                });
              } else {
                callback("Error writing to current file");
              }
            });
          } else {
            callback("Error truncating file");
          }
        });
      } else {
        callback("Could not open the file for updating, it my not exist yet");
      }
    }
  );
};

lib.delete = (dir, file, callback) => {
  fs.unlink(lib.baseDir + dir + "/" + file + ".json", err => {
    if (!err) {
      callback(false);
    } else {
      callback("Error deleting file");
    }
  });
};

lib.list = (dir, callback) => {
  fs.readdir(lib.baseDir + dir + "/", (err, data) => {
    if (!err && data && data.length > 0) {
      let trimmedFileName = [];
      data.forEach(fileName => {
        trimmedFileName.push(fileName.replace(".json", ""));
      });
      callback(false, trimmedFileName);
    } else err, data;
  });
};

module.exports = lib;
