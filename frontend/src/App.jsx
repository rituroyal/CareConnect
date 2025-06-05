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
import DiseasePredictor from './components/DiseasePredictor';

import Footer from './components/Footer';
import { GoogleOAuthProvider } from '@react-oauth/google';


import ChatPage from './Pages/ChatPage';


const GOOGLE_CLIENT_ID="49690093929-ljb1k826u6qc9hal5h06rnn8o8646pqd.apps.googleusercontent.com"

const App = () => {
  return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
        <Route path='/predictor' element={<DiseasePredictor/>}/>
        <Route path='/my-profile' element={<MyProfile/>}/>
        <Route path='/my-appointments' element={<MyAppointments/>}/>
          <Route path='/appointment/:docId' element={<Appointment />} />
          <Route path='/chat' element={<ChatPage />} />
          {/* <Route path='/chat/:roomId' element={<ChatPage />} /> */}
          <Route path='/chat/:roomId/:sender' element={<ChatPage />} />
         
          
      </Routes>
      <Footer />
    </div>
    </GoogleOAuthProvider>
  );
}

console.log("Navbar is rendering");


export default App;
