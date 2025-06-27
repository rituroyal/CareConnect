// import React, { useContext, useState } from 'react';
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import logo from '../assets/images/logo.svg'; // Adjust the path to the actual file
// import profile_pic from '../assets/images/profile_pic.png';  // Change path accordingly
// import dropdown_icon from '../assets/images/dropdown_icon.svg';  // Change path accordingly
// import { assets } from '../assets/images/assets';
// import { AppContext } from '../context/AppContext';

// const Navbar = () => {
//   const navigate = useNavigate();
//     const [showMenu, setShowmenu] = useState(false)
//     // const [token,setToken] = useState(true) //useState(false) create Account button will be shown

//     const { token, setToken, userData } = useContext(AppContext)
    
//     const logout = () => {
//         setToken(false)
//         localStorage.removeItem('token')
//     }
//     return (
      
//     <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
//       {/* Logo */}
//       <img onClick={() =>navigate('/')} className='w-44 cursor-pointer' src={logo} alt="Logo" />

//       {/* Navigation Links */}
//       <ul className="flex gap-6 items-center">
//         {[
//           { path: "/", label: "HOME" },
//           { path: "/doctors", label: "ALL DOCTORS" },
//           { path: "/about", label: "ABOUT" },
//           { path: "/contact", label: "CONTACT" }
//         ].map((link, index) => (
//           <li key={index} className='py-1 text-center'>
//             <NavLink
//   to={link.path}
//   className={({ isActive }) =>
//     `text-gray-700 hover:text-black flex flex-col items-center ${isActive ? "font-bold text-black" : ""}`
//   }
// >
//   {({ isActive }) => (
//     <>
//       {link.label}
//       <hr className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto transition-all duration-300 ${isActive ? "block" : "hidden"}`} />
//     </>
//   )}
// </NavLink>

//           </li>
//         ))}
//       </ul>

//       {/* Create Account Button */}
//             <div className='flex items-center gap-4'>
//                 {
//                     token 
//                         ?
//                         <div className='flex items-center gap-2 cursor-pointer group relative'>
                          
//                     <img className='w-8 rounded-full' src={userData?.image || assets.profile_pic} alt="Profile" />
//                     <img className='w-2.5' src={dropdown_icon} alt="Dropdown" />
//                 <div className='absolute top-0 right-0 pt-15 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
//                   <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
//                     <p onClick={() =>{
//                       console.log("Navigating to My Profile");
//                       navigate('/my-profile')}} className='hover:text-black cursor-pointer'>My Profile</p>
                    

//                     <p onClick={() =>navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
//                     <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
//                   </div>
//                     </div>
//                         </div>  
//                    :     
//         <button onClick={() => navigate('/login')} className="bg-primary text-white px-8 py-3 rounded-full font-bold hidden md:block">Create Account</button>
//           }
//           <img onClick={()=>setShowmenu(true)} className='w-6 mid:hidden' src={assets.menu_icon} alt="" />
//           {/* -------- Mobile Menu ------- */}
//           <div className = {` ${showMenu ? 'fixed w-full':'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
//             <div className='flex items-center justify-between px-5 py-6'>
//               <img className='w-36' src={assets.logo} alt="" />
//               <img className='w-7' onClick={() => setShowmenu(false)} src={assets.cross_icon} alt="" />
//             </div>
//             <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
//               <NavLink  onClick={()=>setShowmenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
//               <NavLink  onClick={()=>setShowmenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
//               <NavLink onClick={()=>setShowmenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
//               <NavLink  onClick={()=>setShowmenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
//             </ul>
//           </div>
//         </div>
//     </div>
//   );
// };

// export default Navbar;

// import React, { useContext, useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import logo from '../assets/images/logo.svg';
// import dropdown_icon from '../assets/images/dropdown_icon.svg';
// import { assets } from '../assets/images/assets';
// import { AppContext } from '../context/AppContext';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [showMenu, setShowmenu] = useState(false);
//   const { token, setToken, userData } = useContext(AppContext);

//   const logout = () => {
//     setToken(false);
//     localStorage.removeItem('token');
//   };

//   const baseLinks = [
//     { path: "/", label: "HOME" },
//     { path: "/doctors", label: "ALL DOCTORS" },
//     { path: "/about", label: "ABOUT" },
//     { path: "/contact", label: "CONTACT" },
//   ];

//   // Conditionally include predictor if logged in
//   if (token) {
//     baseLinks.splice(2, 0, { path: "/predictor", label: "SYMPTOM PREDICTOR" }); // Insert before "ABOUT"
//   }

//   return (
//     <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
//       {/* Logo */}
//       <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={logo} alt="Logo" />

//       {/* Desktop Navigation Links */}
//       <ul className="flex gap-6 items-center">
//         {baseLinks.map((link, index) => (
//           <li key={index} className='py-1 text-center'>
//             <NavLink
//               to={link.path}
//               className={({ isActive }) =>
//                 `text-gray-700 hover:text-black flex flex-col items-center ${isActive ? "font-bold text-black" : ""}`
//               }
//             >
//               {({ isActive }) => (
//                 <>
//                   {link.label}
//                   <hr className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto transition-all duration-300 ${isActive ? "block" : "hidden"}`} />
//                 </>
//               )}
//             </NavLink>
//           </li>
//         ))}
//       </ul>

//       {/* Profile / Create Account */}
//       <div className='flex items-center gap-4'>
//         {token ? (
//           <div className='flex items-center gap-2 cursor-pointer group relative'>
//             <img className='w-8 rounded-full' src={userData?.image || assets.profile_pic} alt="Profile" />
//             <img className='w-2.5' src={dropdown_icon} alt="Dropdown" />
//             <div className='absolute top-0 right-0 pt-15 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
//               <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
//                 <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
//                 <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
//                 <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <button onClick={() => navigate('/login')} className="bg-primary text-white px-8 py-3 rounded-full font-bold hidden md:block">Create Account</button>
//         )}

//         <img onClick={() => setShowmenu(true)} className='w-6 mid:hidden' src={assets.menu_icon} alt="menu" />
        
//         {/* -------- Mobile Menu ------- */}
//         <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
//           <div className='flex items-center justify-between px-5 py-6'>
//             <img className='w-36' src={assets.logo} alt="logo" />
//             <img className='w-7' onClick={() => setShowmenu(false)} src={assets.cross_icon} alt="close" />
//           </div>
//           <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
//             {baseLinks.map((link, index) => (
//               <NavLink key={index} onClick={() => setShowmenu(false)} to={link.path}>
//                 <p className='px-4 py-2 rounded inline-block'>{link.label}</p>
//               </NavLink>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;


import React, { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.svg';
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
      <img onClick={() => navigate('/')} className="w-40 cursor-pointer" src={logo} alt="Logo" />

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
          <img className="w-32" src={assets.logo} alt="Logo" />
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
