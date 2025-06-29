

import React from 'react'
import { assets } from '../assets/images/assets'

const Footer = () => {
  return (
    <div className="px-4 sm:px-6 md:px-10 mt-20">
      <div className="flex flex-col md:grid md:grid-cols-[3fr_1fr_1fr] gap-12 md:gap-14 my-10 text-sm">

        {/* Left Section */}
        <div>
          <img className="mb-5 w-36 sm:w-40" src={assets.logo} alt="CareConnect Logo" />
          <p className="text-gray-600 leading-6 max-w-full md:max-w-[80%]">
            CareConnect is a healthcare app that connects patients with top doctors for hassle-free appointment booking. It offers a seamless experience to browse specialties, check doctor availability, and schedule consultations, ensuring efficient and accessible healthcare services.
          </p>
        </div>

        {/* Center Section */}
        <div>
          <p className="text-lg sm:text-xl font-semibold mb-5 text-gray-800">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li className="hover:text-primary transition">Home</li>
            <li className="hover:text-primary transition">About us</li>
            <li className="hover:text-primary transition">Contact us</li>
            <li className="hover:text-primary transition">Privacy policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <p className="text-lg sm:text-xl font-semibold mb-5 text-gray-800">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li className="hover:text-primary transition">+1-212-456-7890</li>
            <li className="hover:text-primary transition break-words">greatstackdev@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center border-t border-gray-300 pt-5 text-xs sm:text-sm text-gray-600">
        © 2024 CareConnect. All rights reserved.
      </div>
    </div>
  )
}

export default Footer

