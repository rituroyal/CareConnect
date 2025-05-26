import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import Home from './Pages/Home';
import Doctor from './Pages/Doctor'
import Login from './Pages/Login'
import About from './Pages/About'
import Contact from './Pages/Contact'
import MyProfile from './Pages/MyProfile'
import Navbar from './components/Navbar';
import MyAppointments from './Pages/MyAppointments'
import Appointment from './Pages/Appointment';
import Footer from './components/Footer';


const App = () => {
  return (
    
    <div className='mx-4 sm:mx-[10%]'>
       <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/doctors' element={<Doctor/>}/>
        <Route path='/doctors/:speciality' element={<Doctor />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/my-profile' element={<MyProfile/>}/>
        <Route path='/my-appointments' element={<MyAppointments/>}/>
        <Route path='/appointment/:docId' element={<Appointment/>}/>
      </Routes>
      <Footer />
    </div>
  );
}

console.log("Navbar is rendering");


export default App;
