import React from 'react'
import { assets } from '../assets/images/assets'

const about = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Prescripto is a comprehensive Medicare website designed to simplify healthcare access and medication management for patients. It offers a user-friendly platform where users can consult with doctors, upload prescriptions, and receive personalized treatment plans. With a focus on affordability and convenience, Prescripto bridges the gap between patients and quality healthcare services.</p>
          <p>Prescripto empowers users with features like online appointments, digital prescription storage, and easy medicine reordering. The platform ensures secure access to medical records and provides timely reminders for medication and checkups. Whether you're managing chronic conditions or seeking general care, Prescripto makes your healthcare journey efficient and hassle-free.</p>
          <b>Our Vision</b>
          <p>To revolutionize healthcare accessibility by creating a seamless digital platform that connects patients with trusted medical professionals, ensuring timely care, affordable treatment, and a healthier future for all through technology-driven solutions and compassionate service</p>
        </div>
      </div>
      <div className='text-xl my-4'>
        <p>WHY<span className='text-gray-700 font-semibold'>CHOOSE US</span> </p>
      </div>
      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover-bg-primary  hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Efficiency:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover-bg-primary  hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
         <b>Convenience:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover-bg-primary  hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
         <b>Personalization:</b>
          <p>tailored recommendations and remainders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  )
}

export default about
