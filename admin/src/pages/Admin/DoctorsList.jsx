import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className='m-4 sm:m-6 max-h-[90vh] overflow-y-auto'>
      <h1 className='text-lg font-semibold mb-4'>All Doctors</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>

        {doctors.map((item, index) => (
          <div
            key={index}
            className='border border-indigo-200 rounded-xl bg-white overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all'
          >
            <img
              className='w-full h-40 object-cover bg-indigo-50 group-hover:bg-indigo-100 transition-all duration-500'
              src={item.image}
              alt={item.name}
            />

            <div className='p-4 flex flex-col gap-1'>
              <p className='text-gray-800 text-base font-semibold'>{item.name}</p>
              <p className='text-gray-500 text-sm'>{item.speciality}</p>

              <div className='mt-2 flex items-center gap-2 text-sm'>
                <input
                  onChange={() => changeAvailability(item._id)}
                  type='checkbox'
                  checked={item.available}
                />
                <label className='text-gray-700'>Available</label>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );

}

export default DoctorsList
