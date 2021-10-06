// dependencies
var express = require('express');
var router = express.Router();
const fs = require('fs');

// --------------------------------------------------------- Endpoints/Routes

// CRUD - Create, Read, Update, Delete

// get all of a resource - Read
router.get('/', function(req, res) {
    try {
        const rawdata = fs.readFileSync('data.json'); // <Buffer <hex code>
        var users = JSON.parse(rawdata);

        console.log(users);

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get one of a resource - Read
router.get('/:id', function(req, res) {
    try {
        const rawdata = fs.readFileSync('data.json'); // <Buffer <hex code>
        var users = JSON.parse(rawdata);

        console.log(users[req.params.id]);

        res.status(200).json(users[req.params.id]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// create a new resource - Create
router.post('/', function(req, res) {
    try {
        console.log("Posted Object is: ", req.body);
        // open the file
        const rawdata = fs.readFileSync('data.json');
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
        const data = fs.writeFileSync('data.json', JSON.stringify(users));

        // return the data to the user
        res.status(201).json(newObj);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// updated a resource - Update
router.patch('/:id', function(req, res) {
    try {
        console.log("Object being patched is: ", req.params.id, req.body);
        // open the file
        const rawdata = fs.readFileSync('data.json');
        // decode the file (parse) so we can use it
        var users = JSON.parse(rawdata);

        // add data, but controlled
        var id = req.params.id;
        var rawBody = req.body;

        if (rawBody.username != null) users[id].username = rawBody.username;
        if (rawBody.password != null) users[id].password = rawBody.password;

        // save (write) the data back to the file
        const data = fs.writeFileSync('data.json', JSON.stringify(users));

        // return the data to the user
        res.status(200).json(users[id]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// delete a resource - Delete
router.delete('/:id', function(req, res) {
    // capture the id
    var id = req.params.id;

    // open the file for reading
    const rawdata = fs.readFileSync('data.json'); // <Buffer <hex code>
    var users = JSON.parse(rawdata);

    // if found delete it
    if (users.length > id) {
        // modify the object
        users.splice(id, 1);

        // write to the file
        const data = fs.writeFileSync('data.json', JSON.stringify(users));

        res.status(200).json({ message: "ok" });
    } else {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// ----------------------------------------------------------------- end routes/endpoints

module.exports = router;