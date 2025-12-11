import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { PurchaseService } from '../../services/purchaseService.js';

const Sidebar: React.FC = () => {
	const [pendingCount, setPendingCount] = useState(0);

	const menuItems = [
		{ name: 'Dashboard', path: '/educator', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
		{ name: 'Add Course', path: '/educator/add-course', icon: 'M12 4v16m8-8H4' },
		{ name: 'Enrollment Requests', path: '/educator/enroll-student', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', hasBadge: true },
		{ name: 'Manage Admins', path: '/educator/admin-list', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
	];

	useEffect(() => {
		const fetchCount = async () => {
			const pending = await PurchaseService.getRequestsByStatus('pending');
			setPendingCount(pending.length);
		};
		fetchCount();
		
		// Set up an interval to check every 1 hour
		const interval = setInterval(fetchCount, 3600000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className='md:w-64 w-16 bg-white border-r border-gray-200 min-h-screen flex flex-col'>
			<ul className='flex-1 py-4'>
				{menuItems.map((item) => (
					<li key={item.name}>
                    <NavLink to={item.path} end={item.path === '/educator'}
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${isActive ? 'bg-blue-50 border-r-4 border-blue-600' : ''}`}
                    >
                        <div className='relative'>
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
                            {/* THE BADGE */}
                            {item.hasBadge && pendingCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center flex items-center justify-center">
                                    {pendingCount}
                                </span>
                            )}
                        </div>
                        <span className='text-gray-700 font-medium hidden md:block'>{item.name}</span>
                    </NavLink>
                </li>
				))}
			</ul>
		</div>
	);
};

export default Sidebar;