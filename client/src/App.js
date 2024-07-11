import ListHeader from './components/ListHeader'
import ListItem from './components/ListItem'
import Auth from './components/Auth'
import { useEffect, useState } from 'react'

const App = () => {
  const userEmail = 'jasmine.ju753@gmail.com'
  const [ tasks, setTasks ] = useState(null)

  const authToken = false

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`)
      const json = await response.json()
      setTasks(json)
    } catch (err) {   
      console.error(err)
    }
  }
  
  useEffect(() => { 
    if(authToken) {
      getData()
    }}
  , [])

  console.log(tasks)
  
  //tasks sorted by date, where the sortedTasks is an array
  const sortedTasks = tasks?.sort((a,b) => new Date (a.date) - new Date(b.date))

  return (
    <div className="app">
      {!authToken && <Auth/>}
      {authToken &&
        <>
        <ListHeader listName = {'📝 to do list!'} getData={getData}/> 
        {sortedTasks?.map((task) => <ListItem key={task.id} task = {task} getData={getData}/>)}
        </>}
    </div>
  )
}

export default App 
