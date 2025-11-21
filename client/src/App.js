import React, {useEffect, useState} from 'react'
import './App.css';

function App() { 
const [currentTasksData, setCurrentTasksData] = useState([]);
const [completedTasksData, setCompletedTasksData] = useState([]);
const [editTaskID, setEditTaskID] = useState(null);
  const MAX_PRIORITY = 5;
   
  // Loads in the data by quierying the database.
  useEffect(() => {
    fetch("/api/get-current-tasks", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data !== "INVALID") {
              const sorted = data.sort((a, b) => a.priority - b.priority);
              setCurrentTasksData(sorted);
            }
        })
  }, [])
    useEffect(() => {
    fetch("/api/get-completed-tasks", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data !== "INVALID") {
              setCompletedTasksData(data);
            }
        })
  }, [])

  // Constructs the HTML for displaying the current tasks.
  function DisplayCurrentTasks() {
    let rows = [];
    for (let currentTask of currentTasksData) {
      if (editTaskID === currentTask.id) {
        rows.push(
        <div>
          <input type="text" id = "UpdateTask" defaultValue={currentTask.task} required/>
           <select id="UpdatePriority" name="UpdatePriority">
                <option value={currentTask.priority}>{currentTask.priority}</option>
                <DisplayPriorities/>
            </select>
            <input type="date" id="UpdateDue" value={currentTask.due_date} required />
            <button type="button" id="button" onClick={() => UpdateTask(currentTask.id)}>Save</button>
        </div>
        )
        
      } else if (currentTask.id !== undefined) {
        rows.push(
        <div>
          <p key={currentTask.id + "-task"}>{currentTask.task}</p>
          <p key={currentTask.id + "-priority"}>Priority: {currentTask.priority}</p>
          <p>Status: </p>
          <input type="text" id = {"status" + currentTask.id} defaultValue={currentTask.status} required/>
          <button type="button" id={"status" + currentTask.id} onClick={() => UpdateStatus(currentTask.id)}>Update</button>
          <p></p>
          <button type="button" id="button" onClick={() => CompleteTask(currentTask.id)}>Completed</button>
          <button type="button" id="button" onClick={() => setEditTaskID(currentTask.id)}>Edit</button>
        </div>
        )
      }


      
        
    }
    return rows;
  }

    // Constructs the HTML for displaying the completed tasks.
    function DisplayCompletedTasks() {
    let rows = [];
    for (let completedTask of completedTasksData) {
      rows.push(
        <div>
          <p key={completedTask.id + "-completed"}>{completedTask.task}</p>
        </div>
      )
        
    }
    return rows;
  }
  
  // Marks a task as completed by sending it to the server.
  function CompleteTask(task) {
    fetch("api/completed-task", {
      method:'POST',
      body: JSON.stringify({data: task}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data === "VALID") {
        window.location.reload();
      }
      else if(data === "INVALID") {
        console.log("error completing task.");
        alert("Could not complete task.");
      }
    });
  }

  // Updates the status of a task by sending the new data to the server.
  function UpdateStatus(task) {
    console.log(document.getElementById("status" + task).value);
    fetch("api/update-task-status", {
      method:'POST',
      body: JSON.stringify({
        status: document.getElementById("status" + task).value,
        id: task
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data === "VALID") {
        window.location.reload();
      }

      else if (data === "INVALID") {
        console.log("Error updating task status.");
        alert("Could not update task status.");
      }
    });
  }

  // Updates tasks by sending the new data to the server.
  function UpdateTask(task) {
    fetch("api/update-task", {
      method:'POST',
      body: JSON.stringify({
        task: document.getElementById("UpdateTask").value,
        priority: document.getElementById("UpdatePriority").value,
        due_date: document.getElementById("UpdateDue").value,
        id: task
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data === "VALID") {
        window.location.reload();
        alert("Task updated successfully.");
      }

      else if (data === "INVALID") {
        console.log("Error editing task.");
        alert("Could not update task.");
      }
    });
  }

  // Constructs the HTML for displaying the priority options 
  function DisplayPriorities() {
    let rows = [];
    for (let i = 0; i < MAX_PRIORITY; i++) {
      let priority = i + 1;
      rows.push(<option values={priority}>{priority}</option>)
    }
    return rows;
  }

  // Constructs the HTML for the new task form.
  function NewTaskBox() {
    let rows = [];
    rows.push(<div>
        <p>Task:</p>
        <input type="text" id = "NewTask" placeholder="Answer" required/>
        <p>Priority:</p>
        <select id="NewPriority" name="NewPriority">
                <option value="">Select</option>
                <DisplayPriorities/>
      </select>
      <p>Due Date:</p>
      <input type="date" id="NewDue" required />
      </div>
    )
    return rows;
  }

  // Creates a new task by sending the data to the server.
  function SaveNewTask() {

    fetch("api/save-new-task", {
      method:'POST',
      body: JSON.stringify({
        task: document.getElementById("NewTask").value,
        priority: document.getElementById("NewPriority").value,
        due_date: document.getElementById("NewDue").value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data === "VALID") {
        window.location.reload();
        alert("New task saved succssfully.");
      }

      else if (data === "INVALID") {
        console.log("Error saving new task.");
        alert("Could not save new task.");
      }
    });

  }

  // Returns the HTML for the web page.
  return (
    <div className ="task-page">
      <h1>To Do List</h1>
      <h2>Current Tasks</h2>
      <DisplayCurrentTasks/>
      <h2>Add Task</h2>
      <NewTaskBox/>
      <button type="button" id="button" onClick={SaveNewTask}>Save</button>
      <h2>Completed Tasks</h2>
      <DisplayCompletedTasks/>
    </div>
  )
}

export default App