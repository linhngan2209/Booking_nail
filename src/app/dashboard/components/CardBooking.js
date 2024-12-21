import { faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function CardBooking({index,service}) {
  return (
    <div
      key={index}
      className='border p-4 rounded-lg mt-1 shadow-lg transition-transform transform hover:scale-105 bg-blue-50 hover:bg-blue-100'
    >
      <div className='font-semibold text-gray-800'><strong>Customer:</strong> {service.customer}</div>
      <div className='text-gray-600'><strong>Phone:</strong> {service.phone}</div>
      <div className='font-semibold text-gray-800'><strong>Service:</strong> {service.name}</div>
      <div className='text-gray-600'>  <FontAwesomeIcon icon={faClock} className="mr-1" /> {service.start} - {service.end}</div>
    </div>
  )
}
