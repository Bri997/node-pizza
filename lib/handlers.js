const config = require("./config");
const helpers = require("./helpers");

let handlers = {};

handlers.users = (data, callback) => {
  let acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

handlers._users = {};

handlers._users.post = (data, callback) => {
  let firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  let lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  let phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;
  let password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  if (firstName && lastName && phone && password) {
    //Make sure that the user doesn't already exist
    _data.read("users", phone, function(err, data) {
      if (err) {
        //Hash password
        let hashedPassword = helpers.hash(password);

        if (hashedPassword) {
          let userObject = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            hashedPassword: hashedPassword
          };

          //Store the user
          _data.create("users", phone, userObject, function(err) {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, { Error: "could not create new user" });
            }
          });
        } else {
          callback(500, { Error: "Could not hash the user's password" });
        }

        //Create the user object
      } else {
        //User already exists
        callback(400, {
          Error: "A user with that phone number already exist"
        });
      }
    });
  } else callback(400, { Error: "Missing require fields" });
};

handlers.notFound = (data, callback) => {
  console.log(data);
  callback(404);
};

module.exports = handlers;
