import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import Navbar from './components/Navbar';
import Login from './pages_temp/Login'
import MyProfile from './pages_temp/MyProfile'
import Home from './pages_temp/Home';




const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar />
      <Routes>
       <Route path='/' element={<Home/>}/>
        {/* <Route path='/doctors' element={<Doctor/>}/> */}
        {/* <Route path='/doctors/:speciality' element={<Doctor />}/> */}
        <Route path='/login' element={<Login />}/>
        {/* <Route path='/about' element={<About/>}/> */}
        {/* <Route path='/contact' element={<Contact/>}/> */}
        <Route path='/my-profile' element={<MyProfile/>}/>
        {/* <Route path='/my-appointments' element={<MyAppointments/>}/> */}
        {/* <Route path='/appointment/:docId' element={<Appointment/>}/> */}
      </Routes>
      
    </div>
  );
}

console.log("Navbar is rendering");


export default App;
