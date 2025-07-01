import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets';

const AllAppointments = () => {

  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])
  return (
    <div className='w-full max-w-6xl mx-auto px-4 sm:px-6 py-4'>
      <p className='mb-4 text-lg font-semibold'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-auto'>

        {/* Table Header for larger screens */}
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b bg-gray-50 font-medium text-gray-700'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {/* Data Rows */}
        {appointments.map((item, index) => (
          <div
            key={index}
            className='flex flex-col sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-600 py-4 px-6 border-b gap-y-2 sm:gap-0 hover:bg-gray-50 transition'
          >
            {/* Index */}
            <p className='hidden sm:block'>{index + 1}</p>

            {/* Patient */}
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <img className='w-8 h-8 rounded-full object-cover' src={item.userData.image} alt="patient" />
              <p>{item.userData.name}</p>
            </div>

            {/* Age */}
            {/* {console.log('DOB:', item.userData.dob)}
            <p className='hidden sm:block'>{calculateAge(item.userData.dob)}</p> */}


{/* Age */}
<p className='hidden sm:block'>
  {item.userData.dob &&
   item.userData.dob !== "Not Selected" &&
   item.userData.dob !== "" &&
   !isNaN(calculateAge(item.userData.dob))
    ? calculateAge(item.userData.dob)
    : "N/A"}
</p>


            {/* Date & Time */}
            <p className='w-full sm:w-auto'>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

            {/* Doctor */}
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <img className='w-8 h-8 rounded-full object-cover bg-gray-200' src={item.docData.image} alt="doctor" />
              <p>{item.docData.name}</p>
            </div>

            {/* Fees */}
            <p className='w-full sm:w-auto'>{currency}{item.amount}</p>

            {/* Actions */}
            <div className='w-full sm:w-auto'>
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
          </div>
        ))}
      </div>
    </div>
  );

}

export default AllAppointments
