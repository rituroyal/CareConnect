
import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import socket from '../../utils/socket';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const DoctorDashboard = () => {
  const { dToken, dashData, setDashData, getDashData, completeAppointment, cancelAppointment } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);
  const navigate = useNavigate();
  const [unreadChats, setUnreadChats] = useState([]);
  const doctorId = dashData?.docId || dashData?.doctorId || dashData?._id;

  const isChatAllowedDoctor = (item) => {
    if (item.cancelled) return false;
    if (!item.slotDate || !item.slotTime) return false;

    const [day, month, year] = item.slotDate.split('_').map(Number);
    let [time, modifier] = item.slotTime.split(' ');
    let [hour, minute] = time.split(':').map(Number);
    if (modifier?.toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (modifier?.toLowerCase() === 'am' && hour === 12) hour = 0;

    const appointmentDate = new Date(year, month - 1, day, hour, minute);
    const now = new Date();
    const diffMs = now - appointmentDate;
    const diffHours = diffMs / 36e5;

    return diffHours >= 0 && diffHours <= 48;
  };

  useEffect(() => {
    if (doctorId) socket.emit('joinRoom', { roomId: `doctor_${doctorId}` });
  }, [doctorId]);

  useEffect(() => {
    socket.on('newMessageNotification', () => {
      if (doctorId && dToken) {
        axios.get(`/api/chat/unread/${doctorId}`).then(res => {
          setUnreadChats(Array.isArray(res.data) ? res.data : []);
        });
      }
    });
    return () => socket.off('newMessageNotification');
  }, [doctorId, dToken]);

  useEffect(() => {
    if (doctorId && dToken) {
      axios.get(`/api/chat/unread/${doctorId}`).then(res => {
        setUnreadChats(Array.isArray(res.data) ? res.data : []);
      });
    }
  }, [doctorId, dToken]);

  useEffect(() => {
    if (dToken) getDashData();
  }, [dToken]);

  return dashData && (
    <div className='max-w-7xl mx-auto w-full'>
      {/* Dashboard Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {[
          {
            icon: assets.earning_icon,
            value: `${currency} ${dashData.earnings}`,
            label: 'Earnings',
          },
          {
            icon: assets.appointments_icon,
            value: `${dashData.appointments}`,
            label: (
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span>Appointments</span>
                {Array.isArray(unreadChats) && unreadChats.length > 0 && (
                  <span
                    className="mt-1 sm:mt-0 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer"
                    onClick={() => {
                      const roomId = unreadChats[0]?._id || dashData.latestAppointments[0]?._id;
                      if (roomId) navigate(`/chat/${roomId}/doctor`);
                    }}
                  >
                    New Message
                    <span className="ml-1 font-bold">
                      ({unreadChats.reduce((sum, appt) => sum + (appt.unreadCount || 0), 0)})
                    </span>
                  </span>
                )}
              </div>
            ),
          },
          {
            icon: assets.patients_icon,
            value: `${dashData.patients}`,
            label: 'Patients',
          }
        ].map((card, idx) => (
          <div key={idx} className='flex items-center gap-4 bg-white p-4 rounded border border-gray-200 shadow-sm hover:shadow-md transition'>
            <img className='w-12 sm:w-14' src={card.icon} alt="" />
            <div>
              <p className='text-lg sm:text-xl font-semibold text-gray-700'>{card.value}</p>
              <div className='text-gray-400 text-sm'>{card.label}</div> 
            </div>
          </div>
        ))}
      </div>

      {/* Latest Bookings */}
      <div className='bg-white rounded mt-8 overflow-x-auto'>
        <div className='flex items-center gap-2.5 px-4 py-4 border-b'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold text-lg'>Latest Bookings</p>
        </div>

        <div className='divide-y max-h-[65vh] overflow-y-auto'>
          {dashData.latestAppointments.map((item, index) => (
            <div key={index} className='flex flex-col md:flex-row items-start md:items-center justify-between gap-3 px-4 sm:px-6 py-4 hover:bg-gray-50'>
              <div className='flex items-center gap-3'>
                <img className='rounded-full w-10 h-10 object-cover' src={item.userData.image} alt="" />
                <div className='text-sm'>
                  <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                  <p className='text-gray-500'>{slotDateFormat(item.slotDate)}</p>
                </div>
              </div>

              <div className='flex flex-wrap items-center gap-2 mt-2 md:mt-0'>
                {item.cancelled ? (
                  <p className='text-red-500 text-xs font-medium'>Cancelled</p>
                ) : item.isCompleted ? (
                  <>
                    <p className='text-green-500 text-xs font-medium'>Completed</p>
                    <button
                      disabled={!isChatAllowedDoctor(item)}
                      onClick={() => navigate(`/chat/${item._id}/doctor`)}
                      className={`px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold ${!isChatAllowedDoctor(item) ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Chat
                    </button>
                  </>
                ) : (
                  <>
                    <img onClick={() => cancelAppointment(item._id)} className='w-8 cursor-pointer' src={assets.cancel_icon} alt="Cancel" />
                    <img onClick={() => completeAppointment(item._id)} className='w-8 cursor-pointer' src={assets.tick_icon} alt="Complete" />
                    <button
                      disabled={!isChatAllowedDoctor(item)}
                      onClick={() => navigate(`/chat/${item._id}/doctor`)}
                      className={`px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold ${!isChatAllowedDoctor(item) ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Chat
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

