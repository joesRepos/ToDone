const { initDB } = require('./db.js');

const express = require('express');
const app = express();

app.use(express.json());

app.get("/api/get-current-tasks", async (req, res) => {
    try {
        const db = await initDB();
        const tasks = await db.all('SELECT * FROM tasks WHERE completed = 0');
        console.log("Sending all current tasks.");
        res.json(tasks);
    } catch (error) {
        console.log("Error getting tasks: " + error);
        res.json("INVALID");
    }
});

app.get("/api/get-completed-tasks", async (req, res) => {
    try {
        const db = await initDB();
        const tasks = await db.all('SELECT * FROM tasks WHERE completed = 1');
        console.log("Sending all completed tasks.");
        res.json(tasks);
    } catch (error) {
        console.log("Error getting tasks: " + error);
        res.json("INVALID");
    }
});

app.post("/api/save-new-task", async (req, res) => {
    try {
        const db = await initDB();
        const { task, priority, due_date } = req.body;
        await db.run('INSERT INTO tasks (task, priority, due_date) VALUES (?, ?, ?)', [task, priority,due_date]);
        console.log("New task saved.")
        res.json("VALID");
    } catch (error) {
        console.log("Error saving new task: " + error);
        res.json("INVALID");
    }
    
});

app.post("/api/completed-task", async (req, res) => {
    try {
       const data = req.body.data;
        const db = await initDB();
        console.log(data);
        await db.run("UPDATE tasks SET completed = 1 WHERE id = ?", [data]);
        console.log("Task completed.")
        res.json("VALID"); 
    } catch (error) {
        console.log("Error completing task: " + error);
        res.json("INVALID");
    }
    
});

app.listen(5000,() => {console.log("Server started on port 5000")})