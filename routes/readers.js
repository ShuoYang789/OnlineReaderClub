let Reader = require("../models/readers")
let express = require("express")
let router = express.Router()

router.findOne = (req, res) => {
  res.setHeader("Content-Type", "application/json")

  Reader.findOne({"username": req.params.name}, function (err, reader) {
    if (reader == null)
      res.json({message: "Reader NOT Found!"})
    else
      res.send(JSON.stringify(reader, null, 2))
  })
}

router.addReader = (req, res) => {
  res.setHeader("Content-Type", "application/json")

  var reader = new Reader()

  reader.username = req.body.username
  reader.password = req.body.password

  reader.save(function (err) {
    if (err)
      res.send(JSON.stringify({message: "Reader NOT Added!", errmsg: err}, null, 2))
    else
      res.send(JSON.stringify({message: "Reader Added!", data: reader}, null, 2))
  })
}

router.updatePassword = (req, res) => {
  res.setHeader("Content-Type", "application/json")

  Reader.findById({"_id": req.body.id}, function (err, reader) {
    if (err)
      res.send(JSON.stringify({message: "Reader NOT Found!", errmsg: err}, null, 2))
    else {
      reader.password = req.body.password
      reader.save(function (err) {
        if (err)
          res.send(JSON.stringify({message: "Password NOT Updated!", errmsg: err}, null, 2))
        else
          res.send(JSON.stringify({message: "Password Updated!", data: reader}, null, 2))
      })
    }
  })
}

router.deleteReader = (req, res) => {
  Reader.findByIdAndRemove({"_id": req.params.id}, function (err) {
    if (err)
      res.json({message: "Reader NOT Deleted!", errmsg: err})
    else
      res.json({message: "Reader Successfully Deleted!"})
  })
}

module.exports = router