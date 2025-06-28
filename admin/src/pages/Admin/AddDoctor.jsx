import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')

    const { backendUrl, aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (!docImg) {
                return toast.error("Image not Selected")
            }

            const formData = new FormData()

            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            // console log formdata
            formData.forEach((value, key) => {
                console.log(`${key} : ${value}`);
            });

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
            console.log(data)
            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }


    return (
        <form onSubmit={onSubmitHandler} className='p-4 sm:p-6 md:p-8 w-full'>
            <p className='mb-4 text-lg font-semibold text-gray-700'>Add Doctor</p>

            <div className='bg-white px-4 sm:px-6 md:px-8 py-6 rounded border max-w-5xl mx-auto max-h-[85vh] overflow-y-auto'>

                {/* Upload Picture */}
                <div className='flex items-center gap-4 mb-6 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img
                            className='w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full object-cover cursor-pointer'
                            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                            alt="Upload"
                        />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                    <p className='text-sm sm:text-base'>Upload doctor <br /> picture</p>
                </div>

                {/* Columns */}
                <div className='flex flex-col lg:flex-row gap-6 text-gray-600'>

                    {/* Left Column */}
                    <div className='flex-1 flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <p>Doctor name</p>
                            <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2 w-full' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Doctor email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2 w-full' type="email" placeholder='Email' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Doctor Password</p>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2 w-full' type="password" placeholder='Password' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Experience</p>
                            <select onChange={(e) => setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2 w-full'>
                                {Array.from({ length: 10 }, (_, i) => (
                                    <option key={i}>{i + 1} Year</option>
                                ))}
                            </select>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Fees</p>
                            <input onChange={(e) => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2 w-full' type="number" placeholder='Fees' required />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className='flex-1 flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2 w-full'>
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Education</p>
                            <input onChange={(e) => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2 w-full' type="text" placeholder='Education' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2 w-full' type="text" placeholder='Address 1' required />
                            <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2 w-full' type="text" placeholder='Address 2' required />
                        </div>
                    </div>
                </div>

                {/* About + Submit */}
                <div className='mt-6 flex flex-col gap-4 text-gray-600'>
                    <div className='flex flex-col gap-1'>
                        <p className='mb-2'>About Doctor</p>
                        <textarea
                            onChange={(e) => setAbout(e.target.value)}
                            value={about}
                            className='w-full px-4 pt-2 border rounded'
                            placeholder='Write about doctor'
                            rows={4}
                            required
                        />
                    </div>

                    <button type='submit' className='w-fit bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition'>
                        Add Doctor
                    </button>
                </div>
            </div>
        </form>
    );
}

    export default AddDoctor;
