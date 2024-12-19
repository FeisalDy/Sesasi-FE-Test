import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Project } from './pages/Project'
import { NotFound } from './pages/NotFound'
import { Login } from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App () {
  return (
    // <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route index element={<Home />} />
        <Route path='/projects/:id' element={<Project />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
    // </BrowserRouter>
  )
}

export default App
