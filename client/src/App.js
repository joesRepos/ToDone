import React, {useEffect, useState} from 'react'

function App() { 

  const [currentTasksData, setCurrentTasksData] = useState([{}]);
  const [completedTasksData, setCompletedTasksData] = useState([{}]);
  const [editTaskID, setEditTaskID] = useState([{}]);
  const MAX_PRIORITY = 5;

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
              setCurrentTasksData(data);
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

  function DisplayCurrentTasks() {
    let rows = [];
    for (let currentTask of currentTasksData) {
      if (editTaskID === currentTask.id) {
        console.log(JSON.stringify(currentTask.due_date));
        rows.push(
        <div>
          <input type="text" id = "UpdateTask" defaultValue={currentTask.task} required/>
           <select id="UpdatePriority" name="UpdatePriority">
                <option value={JSON.stringify(currentTask.priority)}>{JSON.stringify(currentTask.priority)}</option>
                <DisplayPriorities/>
            </select>
            <input type="date" id="UpdateDue" value={currentTask.due_date} required />
            <button type="button" id="button" onClick={() => UpdateTask(currentTask.id)}>Save</button>
        </div>
        )
        
      } else {
        rows.push(
        <div>
          <p key={currentTask.id}>{JSON.stringify(currentTask.task)}</p>
          <p key={currentTask.id}>Priority: {JSON.stringify(currentTask.priority)}</p>
          <button type="button" id="button" onClick={() => CompleteTask(currentTask.id)}>Completed</button>
          <button type="button" id="button" onClick={() => setEditTaskID(currentTask.id)}>Edit</button>
        </div>
        )
      }
      
        
    }
    return rows;
  }

    function DisplayCompletedTasks() {
    let rows = [];
    for (let completedTask of completedTasksData) {
      rows.push(
        <div>
          <p key={completedTask.id}>{JSON.stringify(completedTask.task)}</p>
        </div>
      )
        
    }
    return rows;
  }
  
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
      }
    });
  }

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
      }

      else if (data === "INVALID") {
        console.log("Error editing task.")
      }
    });
  }

  function DisplayPriorities() {
    let rows = [];
    for (let i = 0; i < MAX_PRIORITY; i++) {
      let priority = i + 1;
      rows.push(<option values={priority}>{priority}</option>)
    }
    return rows;
  }

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
      }

      else if (data === "INVALID") {
        console.log("Error saving new task.")
      }
    });

  }

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