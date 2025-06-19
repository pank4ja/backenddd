const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

// disk storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')  // yeh woh folder hai jaha iamges upload hongi
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function(err, name){  //name buffer hai
      const fn = name.toString("hex")+path.extname(file.originalname)
      cb(null, fn);
    })
  }
})

const upload = multer({ storage: storage });

//export upload variable
module.exports = upload