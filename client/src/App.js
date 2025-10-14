import React, {useEffect, useState} from 'react'

function App() { 

  const [currentTasksData, setCurrentTasksData] = useState([{}])

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
        <div classname = "current-task">{currentTask}</div>
      )
    }
    return rows;
  }

  return (
    <div classname ="task-page">
      <h1>To Do List</h1>
      <h2>Current Tasks</h2>
      <DisplayTasks/>
      <h2>Completed Tasks</h2>
    </div>
  )
}

export default App