import React, {useEffect, useState} from 'react'

function App() { 

  const [currentTasksData, setCurrentTasksData] = useState([{}])
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
            setCurrentTasksData(data.tasks);
        })
  }, [])

  function DisplayTasks() {
    let rows = [];
    for (let currentTask of currentTasksData) {
      console.log(currentTask);
      rows.push(
        <p key={currentTask}>{JSON.stringify(currentTask)}</p>
      )
    }
    return rows;
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
    let newTaskData = [];
    console.log("New Task Saved.")
    newTaskData.push(document.getElementById("NewTask").value);
    newTaskData.push(document.getElementById("NewPriority").value);
    newTaskData.push(document.getElementById("NewDue").value);
    console.log(newTaskData);

    fetch("api/save-new-task", {
      method:'POST',
      body: JSON.stringify({data: newTaskData}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data === "VALID") {
        window.location.reload();
      }
    });

  }

  return (
    <div classname ="task-page">
      <h1>To Do List</h1>
      <h2>Current Tasks</h2>
      <DisplayTasks/>
      <h2>Add Task</h2>
      <NewTaskBox/>
      <button type="button" id="button" onClick={SaveNewTask}>Save</button>
      <h2>Completed Tasks</h2>
    </div>
  )
}

export default App