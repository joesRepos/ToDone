const { initDB } = require('./db.js');

const express = require('express');
const app = express();

app.use(express.json());

const dbPromise = initDB();

// Returns the uncompleted task data from the database.
app.get("/api/get-current-tasks", async (req, res) => {
    try {
        const db = await dbPromise;
        const tasks = await db.all('SELECT * FROM tasks WHERE completed = 0');
        console.log("Sending all current tasks.");
        res.json(tasks);
    } catch (error) {
        console.log("Error getting tasks: " + error);
        res.json("INVALID");
    }
});

// Returns the completed task data from the database.
app.get("/api/get-completed-tasks", async (req, res) => {
    try {
        const db = await dbPromise;
        const tasks = await db.all('SELECT * FROM tasks WHERE completed = 1');
        console.log("Sending all completed tasks.");
        res.json(tasks);
    } catch (error) {
        console.log("Error getting tasks: " + error);
        res.json("INVALID");
    }
});

// Inserts a new task into the database based on the data sent from the client.
app.post("/api/save-new-task", async (req, res) => {
    try {
        const db = await dbPromise;
        const { task, priority, due_date } = req.body;
        await db.run('INSERT INTO tasks (task, priority, due_date) VALUES (?, ?, ?)', [task, priority,due_date]);
        console.log("New task saved.")
        res.json("VALID");
    } catch (error) {
        console.log("Error saving new task: " + error);
        res.json("INVALID");
    }
    
});

// Updates a specified task to completed /
app.post("/api/completed-task", async (req, res) => {
    try {
       const data = req.body.data;
        const db = await dbPromise;
        await db.run("UPDATE tasks SET completed = 1 WHERE id = ?", [data]);
        console.log("Task completed.")
        res.json("VALID"); 
    } catch (error) {
        console.log("Error completing task: " + error);
        res.json("INVALID");
    }
});

//  Updates a task data with the data sent from the lient.
app.post("/api/update-task", async (req, res) => {
    try {
        const { task, priority, due_date, id } = req.body;
        const db = await dbPromise;
        await db.run("UPDATE tasks SET task = ?, priority = ?, due_date = ? WHERE id = ?", [task, priority, due_date, id]);
        console.log("Task updated.")
        res.json("VALID"); 
    } catch (error) {
        console.log("Error completing task: " + error);
        res.json("INVALID");
    }
});

// Updates the status of a task from the client.
app.post("/api/update-task-status", async (req, res) => {
    try {
        const { status, id } = req.body;
        const db = await dbPromise;
        await db.run("UPDATE tasks SET status = ? WHERE id = ?", [status, id]);
        console.log("Status updated.")
        res.json("VALID"); 
    } catch (error) {
        console.log("Error completing task: " + error);
        res.json("INVALID");
    }
});

app.listen(5000,() => {console.log("Server started on port 5000")})