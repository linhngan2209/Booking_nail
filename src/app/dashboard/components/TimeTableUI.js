'use client';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faClock, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';

const ServiceItem = ({ service, onEdit }) => {
    const date = new Date(service?.start);
    const hour = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return (
        <div
            onClick={() => onEdit(service)}
            className="border p-4 rounded-lg mt-2 shadow-md bg-gray-50 hover:bg-gray-200 cursor-pointer"
        >
            <div className="font-semibold text-gray-800">
                <strong>Service:</strong> {service.service}
            </div>
            <div className="text-gray-600">
                <FontAwesomeIcon icon={faClock} className="mr-1" />
                {hour}h : {minutes}
            </div>
            <div className="text-gray-600 mt-1">
                <strong>Customer:</strong> {service.customer}
            </div>
            <div className="text-gray-600 mt-1">
                <strong>Phone:</strong> {service.phone}
            </div>
            <div className="text-gray-600 mt-1">
                <strong>Bill:</strong> {service.bill}
            </div>
            <div className="text-gray-600">
                <strong>Staff:</strong> {service.staff}
            </div>
        </div>
    );
};

export default function TimeTableUI() {
    const [startIndex, setStartIndex] = useState(0);
    const [dateRange, setDateRange] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [appointments, setAppointments] = useState({});
    const [dialogVisible, setDialogVisible] = useState(false);
    const [serviceData, setServiceData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [staffOptions, setStaffOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStaff, setSelectedStaff] = useState(null);
    const fetchStaff = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/list-staff');
            const mappedData = response.data?.map((staff) => ({
                id: staff.id,
                name: staff.staff_name,
                phone: staff.phone_number,
                startDate: staff.start_date,
                avatar: staff?.staff_image,
            }));
            setStaffOptions(mappedData)
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load staff data', life: 3000 });
        } finally {
        }
    };
    useEffect(() => {
        fetchStaff();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/list-bookings/");
                const fetchedData = res.data;

                const groupedAppointments = fetchedData.reduce((acc, appointment) => {
                    const appointmentDate = new Date(appointment.start_date).toLocaleDateString('en-GB');

                    if (!acc[appointmentDate]) {
                        acc[appointmentDate] = [];
                    }

                    const hour = new Date(appointment.start_time).getHours();

                    const newService = {
                        bill: `${appointment.total_bill}$`,
                        service: appointment.service_name,
                        customer: appointment.user_name,
                        start: appointment.start_time,
                        phone: appointment.phone_number,
                        staff: appointment.staff_name,
                    };

                    const existingSlot = acc[appointmentDate].find(slot => slot.hour === hour);

                    if (existingSlot) {
                        existingSlot.services.push(newService);
                    } else {
                        acc[appointmentDate].push({
                            hour: hour,
                            services: [newService],
                        });
                    }

                    return acc;
                }, {});

                setAppointments(groupedAppointments);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const generateDates = (startIndex) => {
            const today = new Date();
            const dates = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + startIndex + i);
                const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
                dates.push({
                    id: i,
                    day: date.toLocaleString('en-US', { weekday: 'short' }),
                    date: formattedDate,
                });
            }
            return dates;
        };

        setDateRange(generateDates(startIndex));
    }, [startIndex]);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleDialogClose = () => {
        setDialogVisible(false);
        setServiceData({ bill: '', service: '', customer: '', start: '', phone: '', staff: null });
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!selectedDate) return alert('Please select a date first.');
    
        const dateKey = selectedDate.date;
        const updatedAppointments = { ...appointments };
        if (!updatedAppointments[dateKey]) updatedAppointments[dateKey] = [];
    
        const newService = { ...serviceData };
        
        const mapData = {
            customer: newService.customer,
            staff: newService.staff.name,  
            service: newService.service,
            start: newService.start,
            phone: newService.phone ,
            total_bill: newService.bill
        }
       
        console.log(mapData)
        try {
            if (isEditing) {
                const response = await axios.put(`http://localhost:8000/api/v1/update-booking/${editingService.id}`, mapData);
                if (response.status === 200) {
                    updatedAppointments[dateKey] = updatedAppointments[dateKey].map((slot) => {
                        slot.services = slot.services.map((service) =>
                            service === serviceData ? newService : service
                        );
                        return slot;
                    });
                    setAppointments(updatedAppointments);
                    alert('Booking updated successfully!');
                }
            } else {
                const response = await axios.post('http://localhost:8000/api/v1/create-booking', 
                mapData, 
                );
                if (response.status === 201) {
                    const existingSlot = updatedAppointments[dateKey].find(
                        (slot) => slot.hour === parseInt(newService.start.split(':')[0])
                    );
    
                    if (existingSlot) {
                        existingSlot.services.push(newService);
                    } else {
                        updatedAppointments[dateKey].push({
                            hour: parseInt(newService.start.split(':')[0]),
                            services: [newService],
                        });
                    }
    
                    setAppointments(updatedAppointments);
                    alert('Booking created successfully!');
                }
            }
    
            handleDialogClose();
        } catch (error) {
            console.error('Error saving booking:', error);
            alert('There was an error saving the booking. Please try again.');
        }
    };
    
    const filteredStaff = staffOptions.filter((staff) =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateStr) => {
        const [day, month, year] = dateStr.split('/');
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/20${year.padStart(2, '0')}`;
    };

    const formattedDate = selectedDate ? formatDate(selectedDate?.date) : null;

    const selectedAppointments = formattedDate ? appointments[formattedDate] : null;
   

    return (
        <div className="flex h-full">
            <div className="w-3/4 p-5 space-y-6">
                <div className="flex justify-between items-center">
                    <Button
                        icon={<FontAwesomeIcon icon={faChevronLeft} />}
                        onClick={() => setStartIndex((prev) => prev - 7)}
                        className="p-button-text p-0"
                        style={{ padding: 0, minWidth: 'auto' }}
                    />
                    <div className="flex w-full justify-between">
                        {dateRange.map((date) => (
                            <div
                                key={date.id}
                                className={`cursor-pointer p-2 rounded flex flex-col items-center justify-center ${selectedDate?.date === date.date ? 'bg-blue-100' : ''
                                    }`}
                                onClick={() => handleDateSelect(date)}
                                style={{ flex: 1, textAlign: 'center' }}
                            >
                                <div>{date.day}</div>
                                <div>{date.date}</div>
                            </div>
                        ))}
                    </div>
                    <Button
                        icon={<FontAwesomeIcon icon={faChevronRight} />}
                        onClick={() => setStartIndex((prev) => prev + 7)}
                        className="p-button-text p-0"
                        style={{ padding: 0, minWidth: 'auto' }}
                    />
                </div>

                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Appointments</h2>
                    <Button
                        label="Add New Schedule"
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={() => {
                            setIsEditing(false);
                            setDialogVisible(true);
                        }}
                        className="bg-primary"
                    />
                </div>
                <div>
                    <div className="mt-6">
                        {selectedAppointments && selectedAppointments.map((slot, index) => (
                            <div key={index}>
                                {slot.services.map((service, i) => (
                                    <ServiceItem
                                        key={i}
                                        service={service}
                                        onEdit={(service) => {
                                            setServiceData(service);
                                            setIsEditing(true);
                                            setDialogVisible(true);
                                        }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-1/4 p-5 bg-gray-100 space-y-4">
                <div className="flex flex-col space-y-4">
                    <InputText
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search Staff"
                        className="w-full"
                    />
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                        {filteredStaff.map((staff) => (
                            <div key={staff.id}>
                                <div
                                    onClick={() => handleStaffClick(staff)}
                                    className={`flex items-center cursor-pointer py-3 px-5 rounded-lg transition-all duration-300 ease-in-out
                ${staff.id === selectedStaff ? "bg-blue-100 border-blue-500 text-blue-700" : ""}
                hover:bg-gray-100 hover:border-gray-300`}
                                >
                                    <img
                                        src={staff.avatar}
                                        alt={staff.name}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <span className="text-base font-semibold">{staff.name}</span>
                                </div>
                                <hr />
                            </div>
                        ))}
                    </div>


                </div>
            </div>

            <Dialog
                visible={dialogVisible}
                style={{ width: '50vw' }}
                header={isEditing ? 'Edit Schedule' : 'Create Schedule'}
                onHide={handleDialogClose}
            >
                <div className="space-y-4">
                    <InputText
                        value={serviceData.service}
                        onChange={(e) => setServiceData({ ...serviceData, service: e.target.value })}
                        placeholder="Service"
                    />
                    <InputText
                        value={serviceData.customer}
                        onChange={(e) => setServiceData({ ...serviceData, customer: e.target.value })}
                        placeholder="Customer"
                    />
                    <InputText
                        value={serviceData.phone}
                        onChange={(e) => setServiceData({ ...serviceData, phone: e.target.value })}
                        placeholder="Phone Number"
                    />
                    <InputText
                        value={serviceData.bill}
                        onChange={(e) => setServiceData({ ...serviceData, bill: e.target.value })}
                        placeholder="Bill"
                    />
                    
                    <InputText
                        value={serviceData.startHour}
                        onChange={(e) => setServiceData({ ...serviceData, start: e.target.value })}
                        placeholder="Start Time"
                    />
                    <Dropdown
                        value={serviceData.staff}
                        onChange={(e) => setServiceData({ ...serviceData, staff: e.value })}
                        options={staffOptions}
                        optionLabel="name"
                        placeholder="Select Staff"
                    />
                    <div className="flex justify-end">
                        <Button label="Save" onClick={handleSave} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
