import React, { useContext } from 'react'
import Header from '../Components/header'
import SpecialityMenu from '../Components/SpecialityMenu'
import TopDoctors from '../Components/TopDoctors'
import Banner from '../Components/Banner'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
// import Footer from '../Components/Footer'
const Home = () => {
  // const navigate = useNavigate();

  // const { token } = useContext(AppContext); 

 
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
      
      {/* <Footer/> */}
    </div>
  )
}

export default Home
