import axios from 'axios'
import './App.css'
import { useEffect } from 'react'

function App() {

   useEffect(() => {
      axios.get('http://localhost:8080/api/search?q=tesla')
         .then(
            response => console.log(response.data)
         )
   }, [])


   return (
      <>
         hello world
      </>
   )
}

export default App
