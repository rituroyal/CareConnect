import React, { useContext, useEffect, useState, useCallback } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import socket from '../../utils/socket';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    getDashData,
    completeAppointment,
    cancelAppointment,
    backendUrl
  } = useContext(DoctorContext);

  const { currency, slotDateFormat } = useContext(AppContext);
  const navigate = useNavigate();

  const [unreadChats, setUnreadChats] = useState([])
  const [unreadLoading, setUnreadLoading] = useState(false)

  const doctorId = dashData?.docId

  const isChatAllowedDoctor = (item) => {
    if (item.cancelled) return false
    if (!item.slotDate || !item.slotTime) return false

    const [day, month, year] = item.slotDate.split('_').map(Number)

    let [time, modifier] = item.slotTime.split(' ')
    let [hour, minute] = time.split(':').map(Number)
    if (modifier?.toLowerCase() === 'pm' && hour < 12) hour += 12
    if (modifier?.toLowerCase() === 'am' && hour === 12) hour = 0

    const appointmentDate = new Date(year, month - 1, day, hour, minute)
    const now = new Date()
    const diffHours = (now - appointmentDate) / 36e5

    return diffHours <= 48
  }

  const fetchUnreadChats = useCallback(async () => {
    if (!doctorId || !dToken) return
    try {
      setUnreadLoading(true)
      const { data } = await axios.get(
        `${backendUrl}/api/chat/unread/${doctorId}`,
        { headers: { Authorization: `Bearer ${dToken}` } }
      )
      setUnreadChats(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to fetch unread chats:", err)
      setUnreadChats([])
    } finally {
      setUnreadLoading(false)
    }
  }, [doctorId, dToken, backendUrl])

  useEffect(() => {
    if (!doctorId) return

    socket.emit('joinRoom', { roomId: `doctor_${doctorId}` })

    const handleNewMessage = ({ roomId }) => {
      fetchUnreadChats()
    }

    socket.on('newMessageNotification', handleNewMessage)

    return () => {
      socket.off('newMessageNotification', handleNewMessage)
    }
  }, [doctorId, fetchUnreadChats])

  useEffect(() => {
    fetchUnreadChats()
  }, [fetchUnreadChats])

  useEffect(() => {
    if (dToken) getDashData()
  }, [dToken])

  const totalUnreadCount = unreadChats.reduce(
    (sum, appt) => sum + (appt.unreadCount || 0), 0
  )

  const goToFirstUnreadChat = () => {
    if (unreadChats.length === 0) return
    const firstUnread = unreadChats[0]
    // _id is the appointmentId = roomId
    navigate(`/chat/${firstUnread._id}/doctor`)
  }

  return dashData && (
    <div className='max-w-7xl mx-auto w-full'>

      {/* Dashboard Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>

        {/* Earnings Card */}
        <div className='flex items-center gap-4 bg-white p-4 rounded border border-gray-200 shadow-sm hover:shadow-md transition'>
          <img className='w-12 sm:w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-lg sm:text-xl font-semibold text-gray-700'>
              {currency} {dashData.earnings}
            </p>
            <p className='text-gray-400 text-sm'>Earnings</p>
          </div>
        </div>

        {/* Appointments Card — with unread badge */}
        <div className='flex items-center gap-4 bg-white p-4 rounded border border-gray-200 shadow-sm hover:shadow-md transition'>
          <img className='w-12 sm:w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-lg sm:text-xl font-semibold text-gray-700'>
              {dashData.appointments}
            </p>
            <div className='flex flex-col sm:flex-row sm:items-center sm:gap-2'>
              <span className='text-gray-400 text-sm'>Appointments</span>

              {/* FIX 14: unread badge — only shows when there are unread messages */}
              {!unreadLoading && totalUnreadCount > 0 && (
                <button
                  onClick={goToFirstUnreadChat}
                  className='mt-1 sm:mt-0 bg-red-500 hover:bg-red-600 text-white rounded-full px-2 py-0.5 text-xs font-medium transition'
                >
                  {/* FIX 15: button instead of span — more semantic for clickable */}
                  New Message ({totalUnreadCount})
                </button>
              )}

              {/* FIX 16: loading state for unread */}
              {unreadLoading && (
                <span className='text-xs text-gray-400 mt-1 sm:mt-0'>
                  Checking messages...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Patients Card */}
        <div className='flex items-center gap-4 bg-white p-4 rounded border border-gray-200 shadow-sm hover:shadow-md transition'>
          <img className='w-12 sm:w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-lg sm:text-xl font-semibold text-gray-700'>
              {dashData.patients}
            </p>
            <p className='text-gray-400 text-sm'>Patients</p>
          </div>
        </div>

      </div>

      {/* Unread Chats Panel — FIX 17: dedicated section for unread messages */}
      {!unreadLoading && unreadChats.length > 0 && (
        <div className='bg-white rounded mt-6 border border-red-100'>
          <div className='flex items-center gap-2 px-4 py-3 border-b bg-red-50 rounded-t'>
            <span className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></span>
            <p className='font-semibold text-red-600 text-sm'>
              Unread Messages ({totalUnreadCount})
            </p>
          </div>
          <div className='divide-y'>
            {unreadChats.map((appt, idx) => (
              <div
                key={appt._id || idx}
                // FIX 18: use appt._id not idx as key
                className='flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer'
                onClick={() => navigate(`/chat/${appt._id}/doctor`)}
              >
                <div className='flex items-center gap-3'>
                  <img
                    className='w-8 h-8 rounded-full object-cover'
                    src={appt.userData?.image}
                    alt=""
                  />
                  <div>
                    <p className='text-sm font-medium text-gray-800'>
                      {appt.userData?.name || 'Patient'}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {appt.slotDate ? slotDateFormat(appt.slotDate) : ''}
                    </p>
                  </div>
                </div>
                <span className='bg-red-500 text-white text-xs rounded-full px-2 py-0.5'>
                  {appt.unreadCount} new
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest Bookings */}
      <div className='bg-white rounded mt-8 overflow-x-auto'>
        <div className='flex items-center gap-2.5 px-4 py-4 border-b'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold text-lg'>Latest Bookings</p>
        </div>

        <div className='divide-y max-h-[65vh] overflow-y-auto'>
          {dashData.latestAppointments.map((item) => (
            <div
              key={item._id}
              // FIX 19: use item._id not index as key
              className='flex flex-col md:flex-row items-start md:items-center justify-between gap-3 px-4 sm:px-6 py-4 hover:bg-gray-50'
            >
              <div className='flex items-center gap-3'>
                <img
                  className='rounded-full w-10 h-10 object-cover'
                  src={item.userData.image}
                  alt=""
                />
                <div className='text-sm'>
                  <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                  <p className='text-gray-500'>{slotDateFormat(item.slotDate)}</p>
                </div>
              </div>

              <div className='flex flex-wrap items-center gap-2 mt-2 md:mt-0'>
                {item.cancelled ? (
                  <p className='text-red-500 text-xs font-medium'>Cancelled</p>

                ) : item.isCompleted ? (
                  <div className='flex items-center gap-2'>
                    <p className='text-green-500 text-xs font-medium'>Completed</p>
                    {/* FIX 20: chat shown for completed too — within 48hr window */}
                    <button
                      disabled={!isChatAllowedDoctor(item)}
                      onClick={() => navigate(`/chat/${item._id}/doctor`)}
                      className={`px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold
                        ${!isChatAllowedDoctor(item) ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
                    >
                      Chat
                    </button>
                  </div>

                ) : (
                  <div className='flex items-center gap-2'>
                    {/* Cancel button */}
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className='w-8 cursor-pointer hover:opacity-70 transition'
                      src={assets.cancel_icon}
                      alt="Cancel"
                      title="Cancel appointment"
                    />
                    {/* Complete button */}
                    <img
                      onClick={() => completeAppointment(item._id)}
                      className='w-8 cursor-pointer hover:opacity-70 transition'
                      src={assets.tick_icon}
                      alt="Complete"
                      title="Mark as completed"
                    />
                    {/* Chat button */}
                    <button
                      disabled={!isChatAllowedDoctor(item)}
                      onClick={() => navigate(`/chat/${item._id}/doctor`)}
                      className={`px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold
                        ${!isChatAllowedDoctor(item)
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-600 transition"}`}
                    >
                      Chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* FIX 21: empty state */}
          {dashData.latestAppointments.length === 0 && (
            <div className='flex items-center justify-center py-8 text-gray-400'>
              <p>No appointments yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard