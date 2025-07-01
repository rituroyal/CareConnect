import React, {useContext,useEffect,useState} from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

// import { assets } from '../assets/images/assets'
const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  
  const isChatAllowed = (item) => {
    if (item.cancelled ) return false;
    if (!item.slotDate || !item.slotTime) return false;
  
    
    const [day, month, year] = item.slotDate.split('_').map(Number);
  
    
    let [time, modifier] = item.slotTime.split(' ');
    let [hour, minute] = time.split(':').map(Number);
    if (modifier && modifier.toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (modifier && modifier.toLowerCase() === 'am' && hour === 12) hour = 0;
  
    const appointmentDate = new Date(year, month - 1, day, hour, minute);
  
    const now = new Date();
    const diffMs = now - appointmentDate;
    const diffHours = diffMs / 36e5;
  
    
    return diffHours >= 0 && diffHours <= 48;
  };
  
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const navigate = useNavigate()

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/my-appointments', { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  const cancelAppointment=async(appointmentId)=>{
    try{
      const{data}= await axios.post(backendUrl+'/api/user/cancel-appointment',{appointmentId},{headers:{ Authorization: `Bearer ${token}` }})
      if(data.success){
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      }else{
        toast.error(data.message)
      }
    }catch(error){
        console.log(error)
        toast.error(error.message)
    }
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay key
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: 'CareConnect',
      description: 'Appointment Payment',
      order_id: order.id, // Order ID from Razorpay
      receipt: order.receipt, // Receipt ID
      handler: async (response) => {
        console.log(response)
        try {
          const { data } = await axios.post(
            backendUrl + '/api/user/verifyRazorpay',response,{headers: { Authorization: `Bearer ${token}` } } 
          );

          if (data.success) {
            toast.success('Payment successful');
            getUserAppointments(); // Refresh appointments
            navigate('/my-appointments')
          } else {
            toast.error(data.message);
          }
        }
        catch (error) {
          console.error('Payment verification failed:', error);
          toast.error('Payment verification failed');
        }
      }
     
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  }
  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        // Initialize Razorpay payment window here
        // For example, using Razorpay's checkout script
        initPay(data.order);
        toast.success('Payment initiated (add Razorpay integration)');
      } else {
        toast.error(data.message);
      }
    }
   catch (error) {
    console.log(error);
    toast.error(error.message);
  }
  }

  
  useEffect(()=>{
    if(token){
      getUserAppointments()
    }
  },[token])
  
   return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      <div>
        {appointments.map((item,index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key ={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end'>
             
              {item.isCompleted && (
      <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500 bg-white cursor-default'>
        Appointment Completed
      </button>
    )}
    <button
      disabled={!isChatAllowed(item)}
      onClick={() => navigate(`/chat/${item._id}/patient`)}
      className={`bg-blue-500 text-white px-4 py-2 rounded mt-2 ${!isChatAllowed(item) ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      Chat with Doctor
    </button>
    {!item.isCompleted && (
              
    <>
      <button
        onClick={() => appointmentRazorpay(item._id)}
        className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-500 hover:text-white transition-all duration-300'
      >
        Pay Online
      </button>
      <button
        onClick={() => cancelAppointment(item._id)}
        className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'
      >
        Cancel appointments
                      </button>
                     
                </>
              )}
            </div>
            </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments



