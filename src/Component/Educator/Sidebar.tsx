import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
	const menuItems = [
		{ name: 'Dashboard', path: '/educator', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
		{ name: 'Add Course', path: '/educator/add-course', icon: 'M12 4v16m8-8H4' },
		{ name: 'Enroll Student', path: '/educator/enroll-student', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' }
	];

	return (
		<div className='md:w-64 w-16 bg-white border-r border-gray-200 min-h-screen flex flex-col'>
			<ul className='flex-1 py-4'>
				{menuItems.map((item) => (
					<li key={item.name}>
						<NavLink
							to={item.path} end={item.path === '/educator'}
							className={({ isActive }) => `flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${isActive ? 'bg-blue-50 border-r-4 border-blue-600' : ''}`}
						>
							<svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
							<span className='text-gray-700 font-medium hidden md:block'>{item.name}</span>
						</NavLink>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Sidebar;