import React from 'react'
import { assets } from '../assets/images/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
          <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
              {/*left- Section  */}
              <div>
                  <img className='mb-5 w-40' src={assets.logo} alt="" />
                  <p className='w-full md:w-2/3 text-gray-600 leading-6'>CareConnect is a healthcare app that connects patients with top doctors for hassle-free appointment booking. It offers a seamless experience to browse specialties, check doctor availability, and schedule consultations, ensuring efficient and accessible healthcare services.</p>
              </div>

              {/*Center- Section  */}
              <div>
                  <p className='text-xl font-medium mb-5'>COMPANY</p>
                  <ul className='flex flex-col gap-2 text-gray-600'>
                      <li>Home</li>
                      <li>About us</li>
                      <li>Contact us</li>
                      <li>Privacy policy</li>
                  </ul>
              </div>


              {/*Right- Section  */}
              <div>
                  <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                  <ul className='flex flex-col gap-2 text-gray-600'>
                      <li>+1-212-456-7890</li>
                      <li>greatstackdev@gmail.com</li>
                  </ul>
              </div>
          </div>
          {/* Copyright Text */}
          <div>
              <hr />
              <p className='py-5 text-sm text-center'>Copyright 2024@ CareConnect - All Right Reserved.</p>
          </div>
    </div>
  )
}

export default Footer
