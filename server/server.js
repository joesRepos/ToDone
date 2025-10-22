const { initDB } = require('./db.js');

const express = require('express');
const app = express();

app.use(express.json());

app.get("/api/get-current-tasks", async (req, res) => {
    console.log("Sending tasks.");
    const db = await initDB();
    const tasks = await db.all('SELECT * FROM tasks');
    res.json(tasks);
});

app.post("/api/save-new-task", async (req, res) => {
    const db = await initDB();
    const { task, priority, due_date } = req.body;
    await db.run('INSERT INTO tasks (task, priority, due_date) VALUES (?, ?, ?)', [task, priority,due_date]);
    res.json("VALID");
});

app.post("/api/completed-task", async (req, res) => {
    const data = req.body.data;
     const db = await initDB();
    await db.run("UPDATE tasks SET completed = 1 WHERE id = ?", [id]);
    res.json("VALID");
});

app.listen(5000,() => {console.log("Server started on port 5000")})