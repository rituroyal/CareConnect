

import React from 'react'
import { assets } from '../assets/images/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const navigate = useNavigate()

  return (
    <div className="relative bg-primary rounded-lg px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 py-8 md:py-16 lg:py-20 md:h-[320px] overflow-hidden flex flex-col md:flex-row items-center md:items-start md:mx-10">
      
      {/* Left Side */}
      <div className="flex-1 text-center md:text-left z-10">
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white">
          <p>Book Appointment</p>
          <p className="mt-3 sm:mt-4">With 100+ Trusted Doctors</p>
        </div>
        <button
          onClick={() => {
            navigate('/login');
            scrollTo(0, 0);
          }}
          className="bg-white text-sm sm:text-base text-gray-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full mt-6 hover:scale-105 transition-all"
        >
          Create account
        </button>
      </div>

      {/* Right Side Image */}
      <img
        src={assets.appointment_img}
        alt="appointment"
        className="hidden md:block absolute bottom-0 right-6 lg:right-10 h-[270px] object-contain z-0"
      />
    </div>
  )
}

export default Banner
