'use client'; 

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserTracking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const fetchBookings = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/v1/user/${user.id}`);
          setBookings(response.data);
        } catch (error) {
          console.error('Error fetching bookings:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchBookings();
    }
  }, [user]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBookings = bookings.filter((booking) =>
    (booking.service ? booking.service.toLowerCase() : '').includes(searchTerm.toLowerCase())
  );

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredBookings.length / pageSize);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8">
      <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-xl">
        <h1 className="text-3xl font-semibold text-center text-[#D8B192] mb-6">
          Booking Tracking
        </h1>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-6 py-3 w-1/2 border-2 border-[#D8B192] rounded-full focus:outline-none focus:ring-2 focus:ring-[#D8B192] shadow-lg"
          />
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-[#D8B192] text-white text-sm">
              <tr>
                <th className="px-6 py-3 text-left">Booking ID</th>
                <th className="px-6 py-3 text-left">Service</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#D8B192] border-t">
                    <td className="px-6 py-4 text-sm font-medium">{booking.id}</td>
                    <td className="px-6 py-4 text-sm">{booking.service_title}</td>
                    <td className="px-6 py-4 text-sm">{booking.start_time}</td>
                    <td className="px-6 py-4 text-sm">{booking.description}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'Confirmed'
                            ? 'bg-green-100 text-green-600'
                            : booking.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 bg-[#D8B192] text-white rounded-md hover:bg-[#D8B192] focus:outline-none"
            disabled={currentPage === 1}
          >
            &lt; Previous
          </button>

          <div className="flex space-x-2">
            {[...Array(totalPages).keys()].map((pageNum) => (
              <button
                key={pageNum + 1}
                onClick={() => handlePageChange(pageNum + 1)}
                className={`px-4 py-2 bg-[#D8B192] text-white rounded-md hover:bg-[#D8B192] focus:outline-none ${
                  currentPage === pageNum + 1 ? 'bg-[#C78F6E]' : ''
                }`}
              >
                {pageNum + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 bg-[#D8B192] text-white rounded-md hover:bg-[#D8B192] focus:outline-none"
            disabled={currentPage === totalPages}
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTracking;
