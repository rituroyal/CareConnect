

import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const DoctorAppointment = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  return (
    <div className="w-full max-w-6xl px-4 md:px-8 py-6">
      <p className="mb-4 text-lg font-semibold">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-auto">
        {/* Desktop Header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b bg-gray-50">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {[...appointments].reverse().map((item, index) => (
          <div
            key={index}
            className="grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] grid-cols-1 gap-y-2 sm:gap-1 py-4 px-4 sm:px-6 border-b hover:bg-gray-50 transition-all duration-300"
          >
            {/* Mobile view */}
            <div className="sm:hidden">
              <div className="flex items-center gap-3 mb-1">
                <img className="w-10 h-10 rounded-full object-cover" src={item.userData.image} alt="patient" />
                <div>
                  <p className="font-medium">{item.userData.name}</p>
                  <p className="text-xs text-gray-500">
                    {slotDateFormat(item.slotDate)}, {item.slotTime}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
                <span>
                  Age:{" "}
                  {item.userData.dob && item.userData.dob !== "Not Selected"
                    ? calculateAge(item.userData.dob)
                    : "N/A"}
                </span>
                <span>Payment: {item.payment ? "Online" : "Offline"}</span>
                <span>Fee: {currency} {item.amount}</span>
              </div>
              <div className="mt-2">
                {item.cancelled ? (
                  <p className="text-red-500 text-xs font-semibold">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-semibold">Completed</p>
                ) : (
                  <div className="flex gap-3">
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className="w-8 cursor-pointer"
                      src={assets.cancel_icon}
                      alt="Cancel"
                    />
                    <img
                      onClick={() => completeAppointment(item._id)}
                      className="w-8 cursor-pointer"
                      src={assets.tick_icon}
                      alt="Complete"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Desktop View */}
            <p className="hidden sm:block">{index + 1}</p>
            <div className="hidden sm:flex items-center gap-3">
              <img className="w-8 h-8 rounded-full object-cover" src={item.userData.image} alt="user" />
              <p>{item.userData.name}</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs inline border border-primary px-2 rounded-full">
                {item.payment ? "Online" : "Offline"}
              </p>
            </div>
            <p className="hidden sm:block">
              {item.userData.dob && item.userData.dob !== "Not Selected"
                ? calculateAge(item.userData.dob)
                : "N/A"}
            </p>
            <p className="hidden sm:block">{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <p className="hidden sm:block">{currency} {item.amount}</p>
            <div className="hidden sm:flex gap-2 items-center">
              {item.cancelled ? (
                <p className="text-red-500 text-xs font-semibold">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-semibold">Completed</p>
              ) : (
                <div className="flex gap-3">
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-8 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
                  <img
                    onClick={() => completeAppointment(item._id)}
                    className="w-8 cursor-pointer"
                    src={assets.tick_icon}
                    alt="Complete"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointment;


