import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):'');
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/appointments', {
        headers: { Authorization: `Bearer ${dToken}` }
      });
      if (data.success) {
        setAppointments(data.appointments); // Reverse to show latest appointments first
        console.log(data.appointments);
        
      } else {
       toast.error(data.message );
      }
    }
    catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("error.message");
    }

  }

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', {
        appointmentId
      }, {
        headers: { Authorization: `Bearer ${dToken}` }
      });
      if (data.success) {
        toast.success(data.message);
        getAppointments(); // Refresh appointments after completion
      } else {
        toast.error(data.message);
      }
    }
    catch (error) {
      console.error("Error completing appointment:", error);
      toast.error("error.message");
    }

  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', {
        appointmentId
      }, {
        headers: { Authorization: `Bearer ${dToken}` }
      });
      if (data.success) {
        toast.success(data.message);
        getAppointments(); // Refresh appointments after completion
      } else {
        toast.error(data.message);
      }
    }
    catch (error) {
      console.error("Error completing appointment:", error);
      toast.error("error.message");
    }

  }

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
