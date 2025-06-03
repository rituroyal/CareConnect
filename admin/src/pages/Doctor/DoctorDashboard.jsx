import React from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

import { useState } from 'react'
import axios from 'axios'
import socket from '../../utils/socket';
import { useNavigate } from 'react-router-dom'

const DoctorDashboard = () => {
  const { dToken, dashData, setDashData, getDashData, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const { currency } = useContext(AppContext)
  const { slotDateFormat } = useContext(AppContext)
  const navigate = useNavigate();

  const [unreadChats, setUnreadChats] = useState([]);
  const doctorId = dashData?.docId || dashData?.doctorId || dashData?._id;
  const [showBadge, setShowBadge] = useState(false);

  const isChatAllowedDoctor = (item) => {
    if (item.cancelled ) return false;
    if (!item.slotDate || !item.slotTime) return false;

    const [day, month, year] = item.slotDate.split('_').map(Number);
    let [time, modifier] = item.slotTime.split(' ');
    let [hour, minute] = time.split(':').map(Number);
    if (modifier && modifier.toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (modifier && modifier.toLowerCase() === 'am' && hour === 12) hour = 0;

    const appointmentDate = new Date(year, month - 1, day, hour, minute);
    const now = new Date();
    const diffMs = now - appointmentDate;
    const diffHours = diffMs / 36e5;

    return diffHours >= 0 && diffHours <= 48;
  };

  useEffect(() => {
    if (doctorId) {
      console.log("Joining room", `doctor_${doctorId}`);
      socket.emit('joinRoom', { roomId: `doctor_${doctorId}` });
    }
  }, [doctorId]);
  useEffect(() => {
    socket.on('newMessageNotification', (data) => {
      console.log("Doctor got new message notification", data);
      setShowBadge(true);
    });
    return () => socket.off('newMessageNotification');
  }, [socket]);
  


  useEffect(() => {
    if (doctorId && dToken) {
      console.log("doctorId", doctorId);
      axios.get(`/api/chat/unread/${doctorId}`).then(res => {
        console.log("Unread chats response:", res.data); 
        setUnreadChats(Array.isArray(res.data) ? res.data : []);
      });
    }
  }, [doctorId, dToken]);

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [dToken])

  useEffect(() => {
    const handleNewMessage = () => {
      if (doctorId && dToken) {
        axios.get(`/api/chat/unread/${doctorId}`).then(res => {
          setUnreadChats(Array.isArray(res.data) ? res.data : []);
        });
      }
    };
    socket.on('newMessageNotification', handleNewMessage);
    return () => socket.off('newMessageNotification', handleNewMessage);
  }, [socket, doctorId, dToken]);
  

  return dashData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{currency} {dashData.earnings}</p>
            <p className='text-gray-400'>Earnings</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments
            

{Array.isArray(unreadChats) && unreadChats.length > 0 && (
    <span
      className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs cursor-pointer"
      onClick={() => {
        const roomId = unreadChats[0]?._id || dashData.latestAppointments[0]?._id;
        if (roomId) navigate(`/chat/${roomId}/doctor`);
      }}
    >
      New Message
      {unreadChats.reduce((sum, appt) => sum + (appt.unreadCount || 0), 0) > 0 && (
        <span className="ml-1 font-bold">
          ({unreadChats.reduce((sum, appt) => sum + (appt.unreadCount || 0), 0)})
        </span>
      )}
    </span>
  )}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>

      </div>
      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {
            dashData.latestAppointments.map((item, index) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                <img className='rounded-full w-10' src={item.userData.image} alt="" />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                  <p className='text-gray-600'>{slotDateFormat(item.slotDate)}</p>
                </div>
                
                
                {
  item.cancelled ? (
    <p className='text-red-400 text-xs font-medium'>Cancelled</p>
  ) : item.isCompleted ? (
    <div className='flex items-center gap-2'>
      <p className='text-green-500 text-xs font-medium'>Completed</p>
      <button
        className={`ml-2 px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold ${!isChatAllowedDoctor(item) ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={!isChatAllowedDoctor(item)}
        onClick={() => navigate(`/chat/${item._id}/doctor`)}
      >
        Chat
      </button>
    </div>
  ) : (
    <div className='flex items-center gap-2'>
      <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
      <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
      <button
        className={`ml-2 px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold ${!isChatAllowedDoctor(item) ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={!isChatAllowedDoctor(item)}
        onClick={() => navigate(`/chat/${item._id}/doctor`)}
      >
        Chat
      </button>
    </div>
  )
}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
