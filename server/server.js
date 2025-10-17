const express = require('express');
const app = express();
app.use(express.json());

app.get("/api/get-current-tasks", (req, res) => {
    console.log("Sending tasks.");
    res.json({"tasks":["task1", "task2", "task3"]})
})

app.post("/api/save-new-task", (req, res) => {
    //const data = req.body.data;
    console.log("Task recieved: " + req.body.data);
    res.json("VALID");
})

app.listen(5000,() => {console.log("Server started on port 5000")})