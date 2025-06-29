
import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/images/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(true)
  const [image, setImage] = useState(false)

  useEffect(() => {
    if (!userData) {
      loadUserProfileData()
    }
  }, [userData])

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('email', userData.email)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)
      if (image) formData.append('image', image)

      const { data } = await axios.put(
        backendUrl + '/api/user/update-profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return userData && (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-0 flex flex-col gap-5 text-sm mt-8 mb-20">

      {/* Profile Image - LEFT aligned */}
      {isEdit ? (
        <label htmlFor="image" className="relative cursor-pointer inline-block">
          <img
            className="w-32 sm:w-36 rounded opacity-80"
            src={image ? URL.createObjectURL(image) : userData.image}
            alt="Profile"
          />
          <img
            className="w-8 sm:w-10 absolute bottom-3 right-3"
            src={image ? '' : assets.upload_icon}
            alt="Upload Icon"
          />
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
        </label>
      ) : (
        <img
          className="w-32 sm:w-36 rounded"
          src={userData.image || assets.profile_pic}
          alt="Profile"
        />
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />

      {/* Name */}
      <div>
        <p className="font-medium">Name:</p>
        {isEdit ? (
          <input
            className="bg-gray-100 p-2 rounded w-full max-w-xs mt-1"
            type="text"
            value={userData.name}
            onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
          />
        ) : (
          <p className="text-gray-700">{userData.name}</p>
        )}
      </div>

      {/* Contact Info */}
      <div>
        <p className="text-neutral-500 underline mt-4 font-semibold">CONTACT INFORMATION</p>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-y-4 mt-3 text-neutral-700 items-center">
          <p className="font-medium">Email id:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 p-2 rounded w-full max-w-xs"
              type="email"
              value={userData.email}
              onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
            />
          ) : (
            <p className="text-gray-700">{userData.email}</p>
          )}

          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 p-2 rounded w-full max-w-xs"
              type="text"
              value={userData.phone}
              onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
            />
          ) : (
            <p className="text-gray-700">{userData.phone}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <div className="space-y-2">
              <input
                className="bg-gray-100 p-2 rounded w-full"
                type="text"
                value={userData.address.line1}
                onChange={(e) =>
                  setUserData(prev => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value }
                  }))
                }
              />
              <input
                className="bg-gray-100 p-2 rounded w-full"
                type="text"
                value={userData.address.line2}
                onChange={(e) =>
                  setUserData(prev => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value }
                  }))
                }
              />
            </div>
          ) : (
            <p className="text-gray-700">
              {userData.address.line1}<br />
              {userData.address.line2}
            </p>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div>
        <p className="text-neutral-500 underline mt-4 font-semibold">BASIC INFORMATION</p>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-y-4 mt-3 text-neutral-700 items-center">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="bg-gray-100 p-2 rounded w-full max-w-[8rem]"
              onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
              value={userData.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-700">{userData.gender}</p>
          )}

          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 p-2 rounded w-full max-w-[10rem]"
              type="date"
              value={userData.dob}
              onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
            />
          ) : (
            <p className="text-gray-700">{userData.dob}</p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8">
      <button
  className="bg-primary text-white px-6 py-2 rounded-full hover:opacity-90 transition-all"
  onClick={isEdit ? updateUserProfileData : () => setIsEdit(true)}
>
  {isEdit ? 'Save Information' : 'Edit'}
</button>

      </div>
    </div>
  )
}

export default MyProfile
