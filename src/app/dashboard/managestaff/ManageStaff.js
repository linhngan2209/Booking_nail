'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';

export default function ManageStaff() {
    const [staff, setStaff] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [newStaff, setNewStaff] = useState({ name: '', phone: '', startDate: '', avatar: '' });
    const [errors, setErrors] = useState({});
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const fetchStaff = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/v1/list-staff');
            const mappedData = response.data?.map((staff) => ({
                id: staff.id,
                name: staff.staff_name,
                phone: staff.phone_number,
                startDate: staff.start_date,
                avatar: staff?.staff_image,
            }));
            setStaff(mappedData);
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load staff data', life: 3000 });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchStaff();
    }, []);

    const validateForm = () => {
        const formErrors = {};
        if (!newStaff.name) formErrors.name = 'Staff Name is required';
        if (!newStaff.phone) formErrors.phone = 'Phone Number is required';
        if (!newStaff.startDate) formErrors.startDate = 'Start Date is required';
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const staffData = {
                staff_name: newStaff.name,
                phone_number: newStaff.phone,
                start_date: newStaff.startDate,
                staff_image: avatarPreview || newStaff.avatar,
            };

            const response = editingStaff
                ? await axios.put(`http://localhost:8000/api/v1/update-staff/${editingStaff.id}`, staffData)
                : await axios.post('http://localhost:8000/api/v1/create-staff', staffData);

            if (response.status === 200) {
                resetModal();
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Staff saved successfully', life: 3000 });
                fetchStaff();
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'There was an error saving the staff', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/delete-staff/${id}`);
            if (res.data?.message === 'success') {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Staff deleted successfully', life: 3000 });
                setStaff(staff.filter((s) => s.id !== id));
            }
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete staff', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        const staffToEdit = staff.find((s) => s.id === id);
        setEditingStaff(staffToEdit);
        setNewStaff({
            name: staffToEdit.name,
            phone: staffToEdit.phone,
            startDate: staffToEdit.startDate,
            avatar: staffToEdit.avatar,
        });
        setAvatarPreview(staffToEdit.avatar);
        setShowModal(true);
    };

    const resetModal = () => {
        setShowModal(false);
        setEditingStaff(null);
        setNewStaff({ name: '', phone: '', startDate: '', avatar: '' });
        setAvatarPreview(null);
        setErrors({});
    };
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
                setNewStaff({ ...newStaff, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const actionTemplate = (rowData) => (
        <div className="flex space-x-2">
            <button onClick={() => handleEdit(rowData.id)} className="text-blue-600">
                <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => handleDelete(rowData.id)} className="text-red-600">
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    );

    const avatarTemplate = (rowData) => (
        <img src={rowData?.avatar || 'https://via.placeholder.com/150'} alt={rowData.name} className="rounded-full w-12 h-12 object-cover" />
    );

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <h1 className="text-3xl font-bold">Staff Manager</h1>
            <div className="mt-7">
                <button
                    className="bg-[#152C70] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#0f214f]"
                    onClick={() => setShowModal(true)}
                >
                    Add new staff
                </button>
            </div>
            <div className="mt-6">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <div className="loader"></div>
                    </div>
                ) : (
                    <DataTable value={staff} responsiveLayout="scroll" paginator
                        rows={5}
                        first={0}
                        rowsPerPageOptions={[5, 10, 25, 50]}>
                        <Column field="id" header="#" style={{ width: '60px' }} />
                        <Column body={avatarTemplate} header="Avatar" style={{ width: '80px' }} />
                        <Column field="name" header="Staff Name" />
                        <Column field="phone" header="Phone Number" />
                        <Column field="startDate" header="Start Date" />
                        <Column body={actionTemplate} header="Actions" />
                    </DataTable>
                )}
            </div>

            <Dialog
                visible={showModal}
                style={{ width: '600px', borderRadius: '8px' }}
                header={editingStaff ? 'Edit Staff' : 'Add New Staff'}
                onHide={resetModal}
            >
                <div className="p-fluid space-y-4">
                    <div className="field">
                        <label htmlFor="name" className="font-semibold">Staff Name</label>
                        <InputText
                            id="name"
                            value={newStaff.name}
                            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                            className={errors.name ? 'p-invalid' : ''}
                        />
                        {errors.name && <small className="p-error">{errors.name}</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="phone" className="font-semibold">Phone Number</label>
                        <InputText
                            id="phone"
                            value={newStaff.phone}
                            onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                            className={errors.phone ? 'p-invalid' : ''}
                        />
                        {errors.phone && <small className="p-error">{errors.phone}</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="startDate" className="font-semibold">Start Date</label>
                        <InputText
                            id="startDate"
                            type="date"
                            value={newStaff.startDate}
                            onChange={(e) => setNewStaff({ ...newStaff, startDate: e.target.value })}
                            className={errors.startDate ? 'p-invalid' : ''}
                        />
                        {errors.startDate && <small className="p-error">{errors.startDate}</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="avatar" className="font-semibold">Avatar</label>
                        <input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className={errors.avatar ? 'p-invalid' : ''}
                        />
                        {avatarPreview && (
                            <img
                                src={avatarPreview}
                                alt="Avatar Preview"
                                className="mt-2 rounded-full w-12 h-12 object-cover"
                            />
                        )}
                        {errors.avatar && <small className="p-error">{errors.avatar}</small>}
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={resetModal} />
                    <Button label="Save" icon="pi pi-check" className="p-button-primary" onClick={handleSave} loading={loading} />
                </div>
            </Dialog>
        </div>
    );
}
