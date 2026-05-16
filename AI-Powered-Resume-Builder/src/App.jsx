import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Dashboard from './pages/dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/login'
import Layout from './pages/layout'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='app' element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder/:resumeId" element={<ResumeBuilder />} />
      </Route>
      <Route path="/view/:resumeId" element={<Preview />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}

export default App