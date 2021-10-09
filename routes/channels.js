// dependencies
var express = require("express");
var router = express.Router();
const fs = require("fs");

// --------------------------------------------------------- Endpoints/Routes

// CRUD - Create, Read, Update, Delete

// get all channels or messages - Read
router.get("/", function(req, res) {
    try {
        const rawdata = fs.readFileSync("channels.json"); // <Buffer <hex code>
        var channels = JSON.parse(rawdata);

        if (req.query.cid) {
            if (channels[req.query.cid]) {
                if (req.query.mid) {
                    var channel = channels.filter(x => x._id == req.query.cid)[0];
                    var messages = channel.messages;
                    if (messages[req.query.mid]) {
                        res.status(200).json(messages[req.query.mid]);
                        console.log(messages[req.query.mid]);
                    } else res.status(404).json({ message: `message ${req.query.mid} does not exist` });
                } else {
                    res.status(200).json(channels[req.query.cid]);
                    console.log(channels[req.query.cid]);
                }
            } else res.status(404).json({ message: `channel ${req.query.cid} does not exist` });
        } else {
            res.status(200).json(channels);
            console.log(channels);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// create a new channel or message - Create
router.post("/", function(req, res) {
    try {
        console.log("Posted Object is: ", req.body);
        // open the file
        const rawdata = fs.readFileSync("channels.json");
        // decode the file (parse) so we can use it
        var channels = JSON.parse(rawdata);
        if (req.query.cid) {
            if (channels.filter(x => x._id == req.query.cid).length ? true : false) {
                var channel = channels.filter(x => x._id == req.query.cid)[0];
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
                var t = new Date(); // make sure there's no mismatched times
                newObj.timestamp = `${t.getMonth()}/${t.getDate()}/${t.getFullYear()} ${t.getHours()}:${t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes()}:${t.getSeconds() < 10 ? "0" + t.getSeconds() : t.getSeconds()} ${t.getHours() > 11 ? "PM" : "AM"}`;;

                // get the actual index
                newObj._id = messages.length;

                // add our new object to the array
                messages.push(newObj);

                // save (write) the data back to the file
                const data = fs.writeFileSync("channels.json", JSON.stringify(channels));

                // return the data to the user
                res.status(201).json(newObj);
            } else res.status(404).json({ message: `channel ${req.query.cid} does not exist` });
        } else {
            // add data, but controlled
            var rawBody = req.body;

            var newObj = {
                name: null,
                messages: []
            };

            if (rawBody.name != null) newObj.name = rawBody.name;

            // get the actual index
            newObj._id = channels.length;


            // add our new object to the array
            channels.push(newObj);

            // save (write) the data back to the file
            const data = fs.writeFileSync("channels.json", JSON.stringify(channels));

            // return the data to the user
            res.status(201).json(newObj);
            res.status(200).json({ message: `created channel ${req.query.cid}` });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// update a channel or message - Update
router.patch("/", function(req, res) {
    try {
        if (req.query.cid) {
            console.log("Channel being patched is: ", req.query.cid);
            // open the file
            const rawdata = fs.readFileSync("channels.json");
            // decode the file (parse) so we can use it
            var channels = JSON.parse(rawdata);
            if (channels.filter(x => x._id == req.query.cid).length ? true : false) {
                if (req.query.mid) {
                    console.log("Message being patched is: ", req.query.mid);
                    console.log(req.body);
                    var channel = channels.filter(x => x._id == req.query.cid)[0];
                    var messages = channel.messages;
                    if (messages.filter(x => x._id == req.query.mid).length ? true : false) {
                        // add data, but controlled
                        var id = req.query.mid;
                        var rawBody = req.body;
                        console.log(id);
                        console.log(rawBody);

                        if (rawBody.username != null) messages[id].username = rawBody.username;
                        if (rawBody.message != null) messages[id].message = rawBody.message;

                        // save (write) the data back to the file
                        const data = fs.writeFileSync("channels.json", JSON.stringify(channels));

                        // return the data to the user
                        res.status(200).json(messages[id]);
                    } else { res.status(404).json({ message: `message ${req.query.mid} does not exist` }); }
                } else {
                    console.log(req.body);
                    // add data, but controlled
                    var id = req.query.cid;
                    var rawBody = req.body;

                    if (rawBody.name != null) channels[id].name = rawBody.name;

                    // save (write) the data back to the file
                    const data = fs.writeFileSync("channels.json", JSON.stringify(channels));

                    // return the data to the user
                    res.status(200).json(channels[id]);
                }
            } else res.status(404).json({ message: `channel ${req.query.cid} does not exist` });
        } else res.status(400).json({ message: "no cid specified" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// delete a channel or message - Delete
router.delete("/", function(req, res) {
    if (req.query.cid) {
        // open the file for reading
        const rawdata = fs.readFileSync("channels.json"); // <Buffer <hex code>
        var channels = JSON.parse(rawdata);
        if (channels.filter(x => x._id == req.query.cid).length ? true : false) {
            if (req.query.mid) {
                var channel = channels.filter(x => x._id == req.query.cid)[0];
                var messages = channel.messages;
                if (messages.filter(x => x._id == req.query.mid).length ? true : false) {
                    // if found delete it
                    // modify the object
                    messages.splice(req.query.mid, 1);

                    // refresh ids
                    for (num of Array(messages.length).keys()) messages[num]._id = num;

                    // write to the file
                    const data = fs.writeFileSync("channels.json", JSON.stringify(channels));

                    res.status(200).json({ message: `message ${req.query.mid} in channel ${req.query.cid} deleted` });
                } else { res.status(404).json({ message: `message ${req.query.mid} does not exist` }); }
            } else {
                // if found delete it
                // modify the object
                channels.splice(req.query.cid, 1);

                // refresh ids
                for (num of Array(channels.length).keys()) channels[num]._id = num;

                // write to the file
                const data = fs.writeFileSync("channels.json", JSON.stringify(channels));

                res.status(200).json({ message: `deleted channel ${req.query.cid}` });
            }
        } else res.status(404).json({ message: `channel ${req.query.cid} does not exist` });
    } else res.status(400).json({ message: "no cid specified" });
});

// ----------------------------------------------------------------- end routes/endpoints

module.exports = router;