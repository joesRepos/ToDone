const express = require('express')
const app = express()

app.get("/api/get-current-tasks", (req, res) => {
    res.json({"tasks":["task1", "task2", "task3"]})
})

app.listen(5000,() => {console.log("Server started on port 5000")})