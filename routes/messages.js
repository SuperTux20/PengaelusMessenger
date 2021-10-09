// dependencies
var express = require("express");
var router = express.Router();
const fs = require("fs");

// --------------------------------------------------------- Endpoints/Routes

// CRUD - Create, Read, Update, Delete

// get all messages - Read
router.get("/", function(req, res) {
    try {
        const rawdata = fs.readFileSync("messages.json"); // <Buffer <hex code>
        var channels = JSON.parse(rawdata);
        var channel = channels.filter(x => x.name == req.body.channel)[0];
        var messages = channel.messages;

        if (req.query.id) {
            if (messages[req.query.id]) {
                res.status(200).json(messages[req.query.id]);
                console.log(messages[req.query.id]);
            } else { res.status(404).json({ message: `message with id ${req.query.id} does not exist` }); }
        } else {
            res.status(200).json(messages);
            console.log(messages);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// create a new message - Create
router.post("/", function(req, res) {
    try {
        console.log("Posted Object is: ", req.body);
        // open the file
        const rawdata = fs.readFileSync("channels.json");
        // decode the file (parse) so we can use it
        var channels = JSON.parse(rawdata);
        var channel = channels.filter(x => x.name == req.query.cid)[0];
        var messages = channel.messages;

        // add data, but controlled
        var rawBody = req.body;

        var newObj = {
            username: null,
            message: null,
            timestamp: null
        };

        if (rawBody.username != null) newObj.username = rawBody.username;
        if (rawBody.message != null) newObj.message = rawBody.message;
        var t = new Date(); // make sure there's no mismatches
        newObj.timestamp = `${t.getMonth()}/${t.getDate()}/${t.getFullYear()} ${t.getHours()}:${t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes()}:${t.getSeconds() < 10 ? "0" + t.getSeconds() : t.getSeconds()} ${t.getHours() > 11 ? "PM" : "AM"}`;;

        // get the actual index
        newObj._id = messages.length;

        // add our new object to the array
        messages.push(newObj);

        // save (write) the data back to the file
        const data = fs.writeFileSync("channels.json", JSON.stringify(channels));

        // return the data to the user
        res.status(201).json(newObj);
    } catch (err) {
        console.log(rawBody);
        if (err.message === "Cannot read properties of undefined (reading 'messages')") res.status(500).json({ message: `channel ${req.body.channel} does not exist` });
        else res.status(500).json({ message: err.message });
    }
});

// update a message - Update
router.patch("/", function(req, res) {
    try {
        console.log("Object being patched is: ", req.params.id, req.body);
        // open the file
        const rawdata = fs.readFileSync("messages.json");
        // decode the file (parse) so we can use it
        var channels = JSON.parse(rawdata);
        var channel = channels.filter(x => x.name == req.body.channel)[0];
        var messages = channel.messages;

        // add data, but controlled
        var id = req.query.mid;
        var rawBody = req.body;

        if (rawBody.username != null) messages[id].username = rawBody.username;
        if (rawBody.message != null) messages[id].message = rawBody.message;

        // save (write) the data back to the file
        const data = fs.writeFileSync("messages.json", JSON.stringify(messages));

        // return the data to the user
        res.status(200).json(messages[id]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// delete a message - Delete
router.delete("/", function(req, res) {
    if (req.query.cid) {
        if (req.query.mid) {
            // open the file for reading
            const rawdata = fs.readFileSync("messages.json"); // <Buffer <hex code>
            var channels = JSON.parse(rawdata);
            var channel = channels.filter(x => x.name == req.query.cid)[0];
            var messages = channel.messages;

            // if found delete it
            // modify the object
            messages.splice(req.query.mid, 1);

            // write to the file
            const data = fs.writeFileSync("messages.json", JSON.stringify(messages));

            res.status(200).json({ message: `message ${req.query.mid} in channel ${req.query.cid} deleted` });
        } else { res.status(404).json({ message: `message ${req.query.mid} does not exist` }); }
    } else { res.status(404).json({ message: `channel ${req.query.cid} does not exist` }); }
});

// ----------------------------------------------------------------- end routes/endpoints

module.exports = router;