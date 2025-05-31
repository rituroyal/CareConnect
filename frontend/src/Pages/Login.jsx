// import React, {useState,useContext,useEffect} from 'react';
// import { AppContext } from '../context/AppContext';
// import axios from 'axios'
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom'



// const Login = () => {
//     const { backendUrl, token, setToken } = useContext(AppContext)
//     const navigate = useNavigate()
//   const [state, setState] = useState('Sign Up')
  
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [name, setName] = useState('')
  
//   const onSubmitHandler = async (event) => {
//       event.preventDefault()
//       try {
//           if (state === 'Sign Up') {
              
//               const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email })
//               if (data.success) {
//                   // // localStorage.setItem('token', data.token)
//                   // // setToken(data.token)
//                   // toast.success('Account created successfully! Please log in.');
//                   // setState('Login');
//                    // Automatically log in user after successful signup:
//                 localStorage.setItem('token', data.token);
//                 setToken(data.token);
//                 toast.success('Account created and logged in successfully!');
//                 navigate('/');  // Redirect after signup & login
//               }
//               else {
//                  toast.error(data.message)
//               }
//           }
//           else {
//               const { data } = await axios.post(backendUrl + '/api/user/login', {password, email })
//               if (data.success) {
//                 localStorage.setItem('token', data.token)
//                 console.log("Token",data.token)
//                   setToken(data.token)
//               }
//               else {
//                  toast.error(data.message)
//               }
//           }
//       }
//       catch (error) {
//           toast.error(error.message)
//       }
//     }
    
//     useEffect(() => {
//         if (token) {
//             navigate('/')
//         }
//     },[token])

//   return (
//     <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
//       <div className ='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
//         <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
//         <p>Please {state === 'Sign Up' ? "sign up" : "log in"} sign up to book appointment</p>
//         {
//           state === "Sign Up" &&
//            <div className='w-full'>
//           <p>Full Name</p>
//           <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setName(e.target.value)} value={name} required />
//         </div>
//         }
       
//         <div className='w-full'>
//           <p>Email</p>
//           <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
//         </div>
//         <div className='w-full'>
//           <p>Password</p>
//           <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
//         </div>
//         <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base'>{state === 'Sign Up' ? "Create Account" : "Login"}</button>
//         {
//           state === "Sign Up" ?
//             <p>Already have an account?<span onClick={()=>setState('Login')} className='text-blue-600 underline cursor-pointer' >Login here</span> </p>
//             :<p>Create an new account ?<span onClick={()=>setState('Sign Up')} className='text-blue-600 underline cursor-pointer'>click here</span></p>
//         }
// </div>
//     </form>
//   );
// };

// export default Login;


// // import React, { useState, useContext, useEffect } from 'react';
// // import { AppContext } from '../context/AppContext';
// // import axios from 'axios';
// // import { toast } from 'react-toastify';
// // import { useNavigate } from 'react-router-dom';

// // const Login = () => {
// //   const { backendUrl, token, setToken } = useContext(AppContext);
// //   const navigate = useNavigate();

// //   const [state, setState] = useState('Sign Up');
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [name, setName] = useState('');

// //   console.log("Current auth state:", state); // 👈 console log for state
// //   console.log("Email:", email); // 👈
// //   console.log("Password:", password); // 👈
// //   console.log("Name:", name); // 👈

// //   const onSubmitHandler = async (event) => {
// //     event.preventDefault();
// //     try {
// //       if (state === 'Sign Up') {
// //         console.log("Submitting Sign Up..."); // 👈

// //         const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email });
// //         console.log("Response from /register:", data); // 👈

// //         if (data.success) {
// //           localStorage.setItem('token', data.token);
// //           setToken(data.token);
// //         } else {
// //           toast.error(data.message);
// //         }
// //       } else {
// //         console.log("Submitting Login..."); // 👈

// //         const { data } = await axios.post(backendUrl + '/api/user/login', { password, email });
// //         console.log("Response from /login:", data); // 👈

// //         if (data.success) {
// //           localStorage.setItem('token', data.token);
// //           setToken(data.token);
// //         } else {
// //           toast.error(data.message);
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Error during submit:", error); // 👈
// //       toast.error(error.message);
// //     }
// //   };

// //   useEffect(() => {
// //     if (token) {
// //       console.log("Token found, navigating to profile..."); // 👈
// //       navigate('/my-profile');
// //     }
// //   }, [token]);

// //   return (
// //     <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center justify-center'>
// //       <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
// //         <p className='text-2xl font-semibold'>
// //           {state === 'Sign Up' ? "Create Account" : "Login"}
// //         </p>
// //         <p>Please {state === 'Sign Up' ? "sign up" : "log in"} to book an appointment</p>

// //         {state === "Sign Up" && (
// //           <div className='w-full'>
// //             <p>Full Name</p>
// //             <input
// //               className='border border-zinc-300 rounded w-full p-2 mt-1'
// //               type="text"
// //               onChange={(e) => setName(e.target.value)}
// //               value={name}
// //               required
// //             />
// //           </div>
// //         )}

// //         <div className='w-full'>
// //           <p>Email</p>
// //           <input
// //             className='border border-zinc-300 rounded w-full p-2 mt-1'
// //             type="email"
// //             onChange={(e) => setEmail(e.target.value)}
// //             value={email}
// //             required
// //           />
// //         </div>

// //         <div className='w-full'>
// //           <p>Password</p>
// //           <input
// //             className='border border-zinc-300 rounded w-full p-2 mt-1'
// //             type="password"
// //             onChange={(e) => setPassword(e.target.value)}
// //             value={password}
// //             required
// //           />
// //         </div>

// //         <button
// //           type='submit'
// //           className='bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md text-base'
// //         >
// //           {state === 'Sign Up' ? "Create Account" : "Login"}
// //         </button>

// //         {state === "Sign Up" ? (
// //           <p>
// //             Already have an account?
// //             <span onClick={() => setState('Login')} className='text-blue-600 underline cursor-pointer'>
// //               Login here
// //             </span>
// //           </p>
// //         ) : (
// //           <p>
// //             Create a new account?
// //             <span onClick={() => setState('Sign Up')} className='text-blue-600 underline cursor-pointer'>
// //               Click here
// //             </span>
// //           </p>
// //         )}
// //       </div>
// //     </form>
// //   );
// // };

// // export default Login;


import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, googleLogout, useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const { backendUrl, token, setToken ,loadUserProfileData } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setName('');
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', {
          name,
          password,
          email,
        });

        if (data.success) {
          toast.success('Account created successfully! Logging you in...');
          setToken(data.token);
          clearForm();
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', {
          password,
          email,
        });

        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          clearForm();
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  

  //Google login handler
  // const handleGoogleLogin = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     try {
  //       const { data } = await axios.post(`${backendUrl}/api/user/google-login`, {
  //         code: tokenResponse.code,
  //       });

  //       localStorage.setItem('token', data.token);
  //       setToken(data.token);
  //       await loadUserProfileData();
  //       setState('Login');
  //       toast.success('Logged in with Google successfully!');
        
  //     } catch (err) {
  //       console.log(err);
  //       toast.error('Google login failed');
  //     }
  //   },
  //   flow: 'auth-code',
  // });
  const handleGoogleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/google-login`, {
        code: tokenResponse.code,
      });
      console.log("Google login backend response:", data);

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        await loadUserProfileData();
        setState('Login');
        toast.success('Logged in with Google successfully!');
      } else {
        toast.error(data.message || 'Google login failed');
      }
    } catch (err) {
      console.log(err);
      toast.error('Google login failed');
    }
  },
  flow: 'auth-code',
});

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/');
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>

        {state === 'Sign Up' && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              disabled={loading}
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            disabled={loading}
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
              ></path>
            </svg>
          ) : null}
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        {state === 'Login' && (
  <>
    <div className="w-full text-center my-3 text-sm text-zinc-500">OR</div>

    <button
      type="button"
      onClick={() => handleGoogleLogin()}
      className="bg-white text-black w-full py-2 border border-zinc-300 rounded-md text-base flex justify-center items-center gap-2 hover:shadow"
    >
      <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
      Continue with Google
    </button>
  </>
)}

        {state === 'Sign Up' ? (
          <p>
            Already have an account?
            <span
              onClick={() => setState('Login')}
              className="text-blue-600 underline cursor-pointer ml-1"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?
            <span
              onClick={() => setState('Sign Up')}
              className="text-blue-600 underline cursor-pointer ml-1"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
