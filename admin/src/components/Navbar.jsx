
import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, logout: doctorLogout } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = () => {
    if (aToken) {
      setAToken('');
      localStorage.removeItem('aToken');
      navigate('/');
    } else if (dToken) {
      doctorLogout();
      navigate('/');
    }
  };

  return (
    <div className="bg-white border-b px-4 sm:px-8 py-3 shadow-sm w-full">
      <div className="flex flex-wrap justify-between items-center gap-2">
        
        {/* Left Section: Logo and Role Tag */}
        <div className="flex items-center gap-2 flex-wrap">
          <img
            className="w-32 sm:w-40 cursor-pointer"
            src={assets.admin_logo}
            alt="logo"
          />
          <span className="text-xs px-2.5 py-0.5 border rounded-full border-gray-500 text-gray-600 whitespace-nowrap">
            {aToken ? 'Admin' : 'Doctor'}
          </span>
        </div>

        {/* Right Section: Logout Button */}
        <div>
          <button
            onClick={logout}
            className="bg-primary text-white text-sm px-5 py-1.5 rounded-full max-w-[160px] w-fit"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
