import React,{useContext} from 'react'
import  {AdminContext } from './context/AdminContext';
import { DoctorContext } from './context/DoctorContext';
import Login from "./pages/Login"
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import DoctorsList from './pages/Admin/DoctorsList';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import Home from '../../frontend/src/Pages/Home';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import { Navigate } from 'react-router-dom';
import ChatPage from '../../frontend/src/Pages/ChatPage'; 


const App = () => {

  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)
  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          {/* Admin Route */}
          {/* <Route path='/' element={<Home/> } /> */}
          <Route path='/admin-dashboard' element={<Dashboard/>} />
          <Route path='/all-appointments' element={<AllAppointments/>} />
          <Route path='/add-doctor' element={<AddDoctor/>} />
          <Route path='/doctor-list' element={<DoctorsList />} />
          
          {/* Doctor Route */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointment />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />

          {/* Default redirect */}
  <Route path='/' element={
    aToken ? <Navigate to="/admin-dashboard" /> :
    dToken ? <Navigate to="/doctor-dashboard" /> :
    <Login />
  } />
  <Route path='*' element={
    aToken ? <Navigate to="/admin-dashboard" /> :
    dToken ? <Navigate to="/doctor-dashboard" /> :
    <Login />
  } />
          
          <Route path='/chat/:roomId/:sender' element={<ChatPage />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer/>
    </>
  )
}

export default App
