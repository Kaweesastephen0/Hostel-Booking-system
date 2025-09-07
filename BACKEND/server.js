import express from "express"

//const express = require("express")

const app = express()
app.get("/api/notes", (req, res) => {
    res.send("You r in")
})
app.listen(5001, () => {
    console.log("Application started on port 5001!!")
})