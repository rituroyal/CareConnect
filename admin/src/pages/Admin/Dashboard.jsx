import React from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='m-4 sm:m-6'>

      {/* Dashboard Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        <div className='flex items-center gap-4 bg-white p-4 rounded border border-gray-200 shadow-sm hover:shadow-md transition'>
          <img className='w-12 sm:w-14' src={assets.doctor_icon} alt="Doctors" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>{dashData.doctors}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white p-4 rounded border border-gray-200 shadow-sm hover:shadow-md transition'>
          <img className='w-12 sm:w-14' src={assets.appointments_icon} alt="Appointments" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white p-4 rounded border border-gray-200 shadow-sm hover:shadow-md transition'>
          <img className='w-12 sm:w-14' src={assets.patients_icon} alt="Patients" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div className='bg-white mt-8 rounded border overflow-hidden'>

        <div className='flex items-center gap-3 px-4 py-4 border-b'>
          <img src={assets.list_icon} alt="List" className='w-5 h-5' />
          <p className='font-semibold text-gray-700'>Latest Bookings</p>
        </div>

        <div className='divide-y'>
          {dashData.latestAppointments.map((item, index) => (
            <div key={index} className='flex flex-col sm:flex-row items-start sm:items-center px-4 sm:px-6 py-3 gap-3 hover:bg-gray-50 transition'>

              <img className='w-10 h-10 rounded-full object-cover' src={item.docData.image} alt="Doctor" />

              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                <p className='text-gray-600 text-xs'>{slotDateFormat(item.slotDate)}</p>
              </div>

              {item.cancelled ? (
                <p className='text-red-500 text-xs font-semibold'>Cancelled</p>
              ) : item.isCompleted ? (
                <p className='text-green-500 text-xs font-semibold'>Completed</p>
              ) : (
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className='w-8 cursor-pointer hover:scale-105 transition'
                  src={assets.cancel_icon}
                  alt="Cancel"
                />
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );

}

export default Dashboard
