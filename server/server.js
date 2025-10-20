const { initDB } = require('./db.js');

const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/api/get-current-tasks", async (req, res) => {
    console.log("Sending tasks.");
    const db = await initDB();
    const tasks = await db.all('SELECT * FROM tasks');
    console.log(tasks);
    res.json({"tasks":["task1", "task2", "task3"]})
});

app.post("/api/save-new-task", async (req, res) => {
    const data = req.body.data;
    const db = await initDB();
    console.log("Task recieved: " + req.body.data);
    await db.run('INSERT INTO tasks (task) VALUES (?)', [data]);
    res.json("VALID");
});

app.post("/api/completed-task", (req, res) => {
    const data = req.body.data;
    
    console.log("Task completed: " + req.body.data);
    res.json("VALID");
});

app.listen(5000,() => {console.log("Server started on port 5000")})