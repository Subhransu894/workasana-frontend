import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Project from './pages/Project'
import Team  from './pages/Team'
import Report from './pages/Report'
import Owners from './pages/Owners'
import TaskDetails from './pages/TaskDetails'
import ProjectDetails from './pages/ProjectDetails'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/project' element={<Project/>} />
           <Route path='/project/:id' element={<ProjectDetails/>} />
          <Route path='/team' element={<Team/>}/>
          <Route path='/report' element={<Report/>} />
          <Route path='/owners' element={<Owners/>}/>
          <Route path='/task/:id' element={<TaskDetails/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
