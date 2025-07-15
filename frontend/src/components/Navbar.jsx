


import React, { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
//  import logo from '../assets/images/logo.svg';
import dropdown_icon from '../assets/images/dropdown_icon.svg';
import { assets } from '../assets/images/assets';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowmenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem('token');
    setShowDropdown(false);
  };

  const baseLinks = [
    { path: "/", label: "HOME" },
    { path: "/doctors", label: "ALL DOCTORS" },
    { path: "/about", label: "ABOUT" },
    { path: "/contact", label: "CONTACT" },
  ];

  if (token) {
    baseLinks.splice(2, 0, { path: "/predictor", label: "SYMPTOM PREDICTOR" });
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-4 mb-5 border-b border-gray-300 relative bg-white z-50">
      
      {/* Logo */}
      {/* <img onClick={() => navigate('/')} className="w-40 cursor-pointer" src={logo} alt="Logo" /> */}
      
   
<div
  onClick={() => navigate('/')}
  className="flex items-center gap-1 cursor-pointer select-none"
>
  {/* Logo image from external link */}
  <img
    src="https://i.pinimg.com/736x/25/dc/47/25dc4724f96ecead1872f71ec2b4c57d.jpg"
    alt="CareConnect Logo"
    className="w-16 h-16 object-contain"
    style={{ borderRadius: "12px" }}
  />
  {/* Logo text */}
  <span className="font-bold text-2xl tracking-wide">
  <span className="text-blue-600">Care</span>
  <span className="text-blue-600">Connect</span>
</span>

</div>


      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-6 items-center text-sm">
        {baseLinks.map((link, index) => (
          <li key={index} className="py-1 text-center">
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `text-gray-700 hover:text-black flex flex-col items-center ${
                  isActive ? "font-bold text-black" : ""
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <hr
                    className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto transition-all duration-300 ${
                      isActive ? "block" : "hidden"
                    }`}
                  />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Right Side (Profile/Login + Hamburger) */}
      <div className="flex items-center gap-4">

        {/* Profile or Login Button */}
        {token ? (
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={userData?.image || assets.profile_pic}
                alt="Profile"
              />
              <img className="w-2.5" src={dropdown_icon} alt="Dropdown" />
            </div>
            {showDropdown && (
              <div className="absolute top-12 right-0 bg-white border rounded-md shadow-md flex-col min-w-[160px] text-sm text-gray-700 z-50 p-2">
                <p
                  onClick={() => {
                    navigate('/my-profile');
                    setShowDropdown(false);
                  }}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  My Profile
                </p>
                <p
                  onClick={() => {
                    navigate('/my-appointments');
                    setShowDropdown(false);
                  }}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  My Appointments
                </p>
                <p
                  onClick={logout}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-primary text-white px-6 py-2 rounded-full font-semibold text-sm hidden md:block"
          >
            Create Account
          </button>
        )}

        {/* Hamburger for Mobile */}
        <img
          onClick={() => setShowmenu(true)}
          className="w-6 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt="Menu"
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[70%] bg-white shadow-md transform transition-transform duration-300 ease-in-out z-50 ${
          showMenu ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          {/* <img className="w-32" src={assets.logo} alt="Logo" /> */}
          <div
    onClick={() => { navigate('/'); setShowmenu(false); }}
    className="flex items-center gap-1 cursor-pointer select-none"
  >
    <img
      src="https://i.pinimg.com/736x/25/dc/47/25dc4724f96ecead1872f71ec2b4c57d.jpg"
      alt="CareConnect Logo"
      className="w-12 h-12 object-contain"
      style={{ borderRadius: "10px" }}
    />
 <span className="font-bold text-2xl tracking-wide">
  <span className="text-blue-600">Care</span>
  <span className="text-blue-600">Connect</span>
</span>


  </div>
          <img
            onClick={() => setShowmenu(false)}
            className="w-6 cursor-pointer"
            src={assets.cross_icon}
            alt="Close"
          />
        </div>
        <ul className="flex flex-col px-6 py-4 gap-4 text-gray-800 font-medium text-sm">
          {baseLinks.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                onClick={() => setShowmenu(false)}
                className={({ isActive }) =>
                  `block py-2 px-2 rounded hover:bg-gray-100 ${
                    isActive ? "font-bold text-black" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          {!token && (
            <button
              onClick={() => {
                navigate('/login');
                setShowmenu(false);
              }}
              className="bg-primary text-white px-4 py-2 rounded-full mt-4"
            >
              Create Account
            </button>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
