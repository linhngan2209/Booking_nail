import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';  // Import Dialog from PrimeReact
import { Button } from 'primereact/button';  // Import Button from PrimeReact

const AppointmentModal = ({ isOpen, closeModal, saveAppointment, initialData }) => {
    const [serviceName, setServiceName] = useState(initialData?.name || '');
    const [customer, setCustomer] = useState(initialData?.customer || '');
    const [start, setStart] = useState(initialData?.start || '');
    const [end, setEnd] = useState(initialData?.end || '');
    const [phone, setPhone] = useState(initialData?.phone || '');

    const handleSubmit = () => {
        saveAppointment({
            name: serviceName,
            customer,
            start,
            end,
            phone,
        });
        closeModal();
    };

    const footer = (
        <div className="flex justify-between">
            <Button label="Cancel" icon="pi pi-times" onClick={closeModal} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={handleSubmit} autoFocus />
        </div>
    );

    return (
        <Dialog
            header={initialData ? 'Update Appointment' : 'Create Appointment'}
            visible={isOpen}
            onHide={closeModal}
            footer={footer}
            style={{ width: '450px' }}
            blockScroll
        >
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="serviceName">Service Name</label>
                    <input
                        id="serviceName"
                        type="text"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        className="p-inputtext p-component"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="customer">Customer Name</label>
                    <input
                        id="customer"
                        type="text"
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        className="p-inputtext p-component"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="phone">Phone</label>
                    <input
                        id="phone"
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="p-inputtext p-component"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="start">Start Time</label>
                    <input
                        id="start"
                        type="time"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        className="p-inputtext p-component"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="end">End Time</label>
                    <input
                        id="end"
                        type="time"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        className="p-inputtext p-component"
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default AppointmentModal;
