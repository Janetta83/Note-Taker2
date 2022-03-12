const express = require("express");
const path = require("path");
const fs = require("fs");
const notes = require("./db/db.json");
const uuid = require("uuid");
const { DH_CHECK_P_NOT_SAFE_PRIME, SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const app = express();
var PORT = process.env.PORT || 3001;

//Middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// Static Middleware
app.use(express.static("./public"));

// Get API db.json
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(_dirname, "./db/db.json"))
});

// Post Function
app.post("/api/notes", (req, res) => {
    const notes = JSON.parse(fs.readFilesSync("./db/db.json"));
    const newNotes = req.body;
    newNotes.id = uuid.v4();
    notes.push(newNotes);
    fs.writeFileSync("./db/db/json", JSON.stringify(notes))
    res.json(notes);
});

// Deleting Notes
app.delete("/api/notes/:id", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const delNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
    fs.writeFileSync("./db/db.json", JSON.stringify(delNote));
    res.json(delNote);
})

//HTML calls
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
//notes.html call
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//Listener
app.listen(PORT, function () {
    console.log("App listener on PORT: " + PORT);
});
