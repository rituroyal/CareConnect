import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const currencySymbol ='₹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors,setDoctors] = useState([])
    const [userData,setUserData] = useState(null)
    const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    

    const getDoctorsData = async() => {
        try{
            const {data} = await axios.get(backendUrl + '/api/doctor/list')
            if(data.success){
               setDoctors(data.doctors) 
            }else{
                toast.error(data.message)
            }
        }catch(error){
            console.log(error)
            toast.error(error.message)
        }
    }

    const loadUserProfileData = async () => {
        try {
            console.log('Token before sending:', token); 
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers:{ Authorization: `Bearer ${token}` }})
            
            if (data.success) {
                setUserData(data.userData)
            }
            else {
                toast.error(data.message)
                setUserData(null);
            }
        }
        catch (error) {
             console.log(error)
            toast.error(error.message)
            setUserData(null);
        }
    }

    const value = {
        doctors,
        getDoctorsData,
        currencySymbol,
        token, setToken,
        backendUrl,
        userData, setUserData,
        loadUserProfileData
    }

    useEffect(() => {
        getDoctorsData()
    }, [])
    
    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(null)
        }
    },[token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
export default AppContextProvider