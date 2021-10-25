// dependencies
var express = require("express");
var router = express.Router();
const fs = require("fs");

// --------------------------------------------------------- Endpoints/Routes

// CRUD - Create, Read, Update, Delete

// get user(s) - Read
router.get("/", function(req, res) {
	try {
		const rawdata = fs.readFileSync("users.json"); // <Buffer <hex code>
		var users = JSON.parse(rawdata);

		if (req.query.uid) {
			if (users[req.query.uid]) {
				res.status(200).json(users[req.query.uid]);
				console.log(users[req.query.uid]);
			} else res.status(404).json({ message: `user ${req.query.uid} does not exist` });
		} else {
			res.status(200).json(users);
			console.log(users);
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// create a new user - Create
router.post("/", function(req, res) {
	try {
		console.log("Posted Object is: ", req.body);
		// open the file
		const rawdata = fs.readFileSync("users.json");
		// decode the file (parse) so we can use it
		var users = JSON.parse(rawdata);

		// add data, but controlled
		var rawBody = req.body;

		var newObj = {
			username: null,
			password: null
		};

		if (rawBody.username != null) newObj.username = rawBody.username;
		if (rawBody.password != null) newObj.password = rawBody.password;

		// get the actual index
		newObj._id = users.length;


		// add our new object to the array
		users.push(newObj);

		// save (write) the data back to the file
		fs.writeFileSync("users.json", JSON.stringify(users));

		// return the data to the user
		res.status(201).json(newObj);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// update a user - Update
router.patch("/", function(req, res) {
	try {
		if (req.query.uid) {
			console.log("Object being patched is: ", req.query.uid, req.body);
			// open the file
			const rawdata = fs.readFileSync("users.json");
			// decode the file (parse) so we can use it
			var users = JSON.parse(rawdata);

			// add data, but controlled
			var id = req.query.uid;
			var rawBody = req.body;

			if (rawBody.username != null) users[id].username = rawBody.username;
			if (rawBody.password != null) users[id].password = rawBody.password;

			// save (write) the data back to the file
			fs.writeFileSync("users.json", JSON.stringify(users));

			// return the data to the user
			res.status(200).json(users[id]);
		} else res.status(404).json({ message: `user ${req.query.uid} does not exist` });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// delete a user - Delete
router.delete("/", function(req, res) {
	if (req.query.uid) {
		// open the file for reading
		const rawdata = fs.readFileSync("users.json"); // <Buffer <hex code>
		var users = JSON.parse(rawdata);
		if (users.filter(x => x._id == req.query.uid).length ? true : false) { // if found delete it
			// modify the object
			users.splice(req.query.uid, 1);

			// refresh ids
			for (let num of Array(users.length).keys()) users[num]._id = num;

			// write to the file
			fs.writeFileSync("users.json", JSON.stringify(users));

			res.status(200).json({ message: `deleted user ${req.query.uid}` });
		} else res.status(404).json({ message: `user ${req.query.uid} does not exist` });
	} else res.status(400).json({ message: "no uid specified" });
});

// ----------------------------------------------------------------- end routes/endpoints

module.exports = router;