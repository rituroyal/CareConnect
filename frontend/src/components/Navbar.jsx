import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.svg'; // Adjust the path to the actual file
// import profile_pic from '../assets/images/profile_pic.png';  // Change path accordingly
import dropdown_icon from '../assets/images/dropdown_icon.svg';  // Change path accordingly
import { assets } from '../assets/images/assets';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
    const [showMenu, setShowmenu] = useState(false)
    // const [token,setToken] = useState(true) //useState(false) create Account button will be shown

    const { token, setToken, userData } = useContext(AppContext)
    
    const logout = () => {
        setToken(false)
        localStorage.removeItem('token')
    }
    return (
      
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      {/* Logo */}
      <img onClick={() =>navigate('/')} className='w-44 cursor-pointer' src={logo} alt="Logo" />

      {/* Navigation Links */}
      <ul className="flex gap-6 items-center">
        {[
          { path: "/", label: "HOME" },
          { path: "/doctors", label: "ALL DOCTORS" },
          { path: "/about", label: "ABOUT" },
          { path: "/contact", label: "CONTACT" }
        ].map((link, index) => (
          <li key={index} className='py-1 text-center'>
            <NavLink
  to={link.path}
  className={({ isActive }) =>
    `text-gray-700 hover:text-black flex flex-col items-center ${isActive ? "font-bold text-black" : ""}`
  }
>
  {({ isActive }) => (
    <>
      {link.label}
      <hr className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto transition-all duration-300 ${isActive ? "block" : "hidden"}`} />
    </>
  )}
</NavLink>

          </li>
        ))}
      </ul>

      {/* Create Account Button */}
            <div className='flex items-center gap-4'>
                {
                    token && userData
                        ?
                        <div className='flex items-center gap-2 cursor-pointer group relative'>
                          
                    <img className='w-8 rounded-full' src={userData.image} alt="Profile" />
                    <img className='w-2.5' src={dropdown_icon} alt="Dropdown" />
                <div className='absolute top-0 right-0 pt-15 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                  <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                    <p onClick={() =>navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                    <p onClick={() =>navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                    <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                  </div>
                    </div>
                        </div>  
                   :     
        <button onClick={() => navigate('/login')} className="bg-primary text-white px-8 py-3 rounded-full font-bold hidden md:block">Create Account</button>
          }
          <img onClick={()=>setShowmenu(true)} className='w-6 mid:hidden' src={assets.menu_icon} alt="" />
          {/* -------- Mobile Menu ------- */}
          <div className = {` ${showMenu ? 'fixed w-full':'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
            <div className='flex items-center justify-between px-5 py-6'>
              <img className='w-36' src={assets.logo} alt="" />
              <img className='w-7' onClick={() => setShowmenu(false)} src={assets.cross_icon} alt="" />
            </div>
            <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
              <NavLink  onClick={()=>setShowmenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
              <NavLink  onClick={()=>setShowmenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
              <NavLink onClick={()=>setShowmenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
              <NavLink  onClick={()=>setShowmenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
            </ul>
          </div>
        </div>
    </div>
  );
};

export default Navbar;
