'use client'; // Đánh dấu là Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TimeTable from './dashboard/timetable/TimeTable';
import ManageStaff from './dashboard/managestaff/ManageStaff';
import ManageServices from './dashboard/manageservice/ManageService';
import IcDashboard from '@/icon/dashboard.svg';
import IcDashboardSelect from '@/icon/dashboardSelect.svg';
import IcService from '@/icon/service.svg';
import IcServiceSelect from '@/icon/serviceSelect.svg';
import IcStaff from '@/icon/staff.svg';
import IcStaffSelect from '@/icon/staffSelect.svg';
import IcTime from '@/icon/time.svg';
import IcTimeSelect from '@/icon/timeSelect.svg';
import IcLogout from '@/icon/logout.svg';

const Dashboard = () => {
    const [currentTab, setCurrentTab] = useState('DASHBOARD');
    const [showSideBar, setShowSideBar] = useState(true);
    const router = useRouter();

    const handleTabChange = (newTab) => {
        setCurrentTab(newTab);
        router.push(`?path=${newTab}`);
    };

    return (
        <div className="flex h-screen">
            {showSideBar && (
                <div className="w-20 bg-gray-100 border-r-2 flex flex-col justify-between p-4">
                    <div className="flex flex-col items-center">
                        <img className="w-12 h-12" src="/sidebarlogo.svg" alt="Logo" />
                    </div>
                    <div className="flex-grow flex flex-col justify-start pt-16 items-center gap-12">
                        <div
                            className={`cursor-pointer ${currentTab === 'DASHBOARD' ? 'text-blue-500' : ''}`}
                            onClick={() => handleTabChange('DASHBOARD')}
                        >
                            {currentTab === 'DASHBOARD' ? <IcDashboardSelect /> : <IcDashboard />}
                        </div>
                        <div
                            className={`cursor-pointer ${currentTab === 'TIMETABLE' ? 'text-blue-500' : ''}`}
                            onClick={() => handleTabChange('TIMETABLE')}
                        >
                            {currentTab === 'TIMETABLE' ? <IcTimeSelect /> : <IcTime />}
                        </div>

                        <div
                            className={`cursor-pointer ${currentTab === 'STAFF' ? 'text-blue-500' : ''}`}
                            onClick={() => handleTabChange('STAFF')}
                        >
                            {currentTab === 'STAFF' ? <IcStaffSelect /> : <IcStaff />}
                        </div>

                        <div
                            className={`cursor-pointer ${currentTab === 'SERVICE' ? 'text-blue-500' : ''}`}
                            onClick={() => handleTabChange('SERVICE')}
                        >
                            {currentTab === 'SERVICE' ? <IcServiceSelect /> : <IcService />}
                        </div>
                    </div>

                    <div className="cursor-pointer">
                        <IcLogout />
                    </div>
                </div>
            )}

            <main className="flex-grow p-4 h-screen overflow-y-auto">
                {currentTab === 'DASHBOARD' && <div>Welcome to Dashboard</div>}
                {currentTab === 'TIMETABLE' && <TimeTable />}
                {currentTab === 'STAFF' && <ManageStaff />}
                {currentTab === 'SERVICE' && <ManageServices />}
            </main>
        </div>
    );
};

export default Dashboard;
