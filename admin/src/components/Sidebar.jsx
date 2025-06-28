import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { assets } from '../assets/assets';

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Mobile Header */}
      <div className='md:hidden p-4 flex justify-between items-center border-b bg-white'>
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl font-bold">
          &#9776;
        </button>

      </div>

      {/* Sidebar Menu */}
      <div className={`bg-white border-r md:min-h-screen ${isOpen ? 'block' : 'hidden'} md:block`}>
        {aToken && (
          <ul className='text-[#515151] mt-5'>
            <SidebarLink to="/admin-dashboard" icon={assets.home_icon} label="Dashboard" />
            <SidebarLink to="/all-appointments" icon={assets.appointment_icon} label="Appointments" />
            <SidebarLink to="/add-doctor" icon={assets.add_icon} label="Add Doctor" />
            <SidebarLink to="/doctor-list" icon={assets.people_icon} label="Doctors List" />
          </ul>
        )}

        {dToken && (
          <ul className='text-[#515151] mt-5'>
            <SidebarLink to="/doctor-dashboard" icon={assets.home_icon} label="Dashboard" />
            <SidebarLink to="/doctor-appointments" icon={assets.appointment_icon} label="Appointments" />
            <SidebarLink to="/doctor-profile" icon={assets.people_icon} label="Profile" />
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

// SidebarLink subcomponent (can be placed above or below Sidebar)
const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary font-medium' : ''
      }`
    }
  >
    <img src={icon} alt={label} className='w-5 h-5' />
    <p className='hidden md:block'>{label}</p>
  </NavLink>
);
