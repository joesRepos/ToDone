import React, {useEffect, useState} from 'react'

function App() { 

  const [backendData, setBackEndData] = useState([{}])

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackEndData(data)
      }
    )
  }, [])

  return (
    <div>
      {(typeof backendData.tasks === 'undefined') ? (
        <p>Loading...</p>
      ): (
        backendData.tasks.map((task, i) => (
          <p key={i}>{task}</p>
        ))
  )}
    </div>
  )
}

export default App