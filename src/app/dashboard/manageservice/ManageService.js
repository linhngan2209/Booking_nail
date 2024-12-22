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
import debounce from 'lodash.debounce';

const ManageService = () => {
    const [services, setServices] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [newService, setNewService] = useState({ service_category: '', service_title: '', service_price: '', service_image: '' });
    const [errors, setErrors] = useState({});
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const api = axios.create({
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
    });

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/list-services/`);
            setServices(response.data?.services);
            setTotalRecords(response.data.total);
        } catch (err) {
            console.error('Error fetching services:', err);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load service data',
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchServices(1); 
    }, []);


    const validateForm = () => {
        const formErrors = {};
        if (!newService.service_category) formErrors.service_category = 'Service category is required';
        if (!newService.service_title) formErrors.service_title = 'Service title is required';
        if (!newService.service_price) formErrors.service_price = 'Service price is required';
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const serviceData = {
                service_category: newService.service_category,
                service_title: newService.service_title,
                service_price: newService.service_price,
                service_image: avatarPreview || newService.service_image,
            };

            const response = editingService
                ? await api.put(`/update-service/${editingService.id}`, serviceData)
                : await api.post('/create-service', serviceData);

            if (response.status === 200) {
                resetModal();
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Service saved successfully', life: 3000 });
                fetchServices();
            }
            if (response.status === 403) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'You do not have permission to access this resource.', life: 3000 });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'There was an error saving the service', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const res = await api.delete(`/delete-service/${id}`);
            if (res.data?.message === 'success') {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Service deleted successfully', life: 3000 });
                setServices(services.filter((s) => s.id !== id));
            }
            if (response.status === 403) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'You do not have permission to access this resource.', life: 3000 });
            }
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete service', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        const serviceToEdit = services.find((s) => s.id === id);
        setEditingService(serviceToEdit);
        setNewService({
            service_category: serviceToEdit.service_category,
            service_title: serviceToEdit.service_title,
            service_price: serviceToEdit.service_price,
            service_image: serviceToEdit.service_image,
        });
        setAvatarPreview(serviceToEdit.service_image);
        setShowModal(true);
    };

    const resetModal = () => {
        setShowModal(false);
        setEditingService(null);
        setNewService({ service_category: '', service_title: '', service_price: '', service_image: '' });
        setAvatarPreview(null);
        setErrors({});
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
                setNewService({ ...newService, service_image: reader.result });
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
        <img src={rowData?.service_image || 'https://via.placeholder.com/150'} alt={rowData.service_title} className="rounded-full w-12 h-12 object-cover" />
    );

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <h1 className="text-3xl font-bold">Service Manager</h1>
            <div className="mt-7">
                <button
                    className="bg-[#152C70] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#0f214f]"
                    onClick={() => setShowModal(true)}
                >
                    Add new Service
                </button>
            </div>
            <div className="mt-6">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <div className="loader"></div>
                    </div>
                ) : (
                    <DataTable
                        value={services}
                        paginator
                        rows={rows}
                        first={first}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        loading={loading}
                    >
                        <Column field="id" header="#" style={{ width: '60px' }} />
                        <Column body={avatarTemplate} header="Avatar" style={{ width: '80px' }} />
                        <Column field="service_category" header="Category" />
                        <Column field="service_title" header="Service Title" />
                        <Column field="service_price" header="Price" />
                        <Column body={actionTemplate} header="Actions" />
                    </DataTable>
                )}
            </div>

            <Dialog
                visible={showModal}
                onHide={resetModal}
                header={editingService ? 'Edit Service' : 'Add New Service'}
            >
                <div className="form-group">
                    <label>Service Category</label>
                    <InputText
                        value={newService.service_category}
                        onChange={(e) => setNewService({ ...newService, service_category: e.target.value })}
                        className={`w-full ${errors.service_category && 'p-invalid'}`}
                    />
                    {errors.service_category && <small className="p-error">{errors.service_category}</small>}
                </div>
                <div className="form-group">
                    <label>Service Title</label>
                    <InputText
                        value={newService.service_title}
                        onChange={(e) => setNewService({ ...newService, service_title: e.target.value })}
                        className={`w-full ${errors.service_title && 'p-invalid'}`}
                    />
                    {errors.service_title && <small className="p-error">{errors.service_title}</small>}
                </div>
                <div className="form-group">
                    <label>Service Price</label>
                    <InputText
                        value={newService.service_price}
                        onChange={(e) => setNewService({ ...newService, service_price: e.target.value })}
                        className={`w-full ${errors.service_price && 'p-invalid'}`}
                    />
                    {errors.service_price && <small className="p-error">{errors.service_price}</small>}
                </div>
                <div className="form-group">
                    <label>Service Image</label>
                    <input type="file" onChange={handleAvatarChange} />
                    {avatarPreview && <img src={avatarPreview} alt="Avatar preview" className="mt-3 rounded-full w-20 h-20 object-cover" />}
                </div>
                <div className="mt-4 flex justify-between">
                    <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={resetModal} />
                    <Button label="Save" icon="pi pi-check" className="p-button-primary" onClick={handleSave} />
                </div>
            </Dialog>
        </div>
    );
};

export default ManageService;
