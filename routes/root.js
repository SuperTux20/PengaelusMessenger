// dependencies
var express = require("express");
var router = express.Router();

// --------------------------------------------------------- Endpoints/Routes

// base route localhost:port/
router.get("/", function(req, res) {
    res.status(200).json({ message: "welcome to Pengaelus Messenger" });
});



// ----------------------------------------------------------------- end routes/endpoints

module.exports = router;