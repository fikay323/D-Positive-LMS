import React from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../../Component/Educator/Sidebar.js';
import Navbar from '../../Component/Educator/Navbar.js';
import Footer from '../../Component/Educator/Footer.js';

const Educator: React.FC = () => {
	return (
		<div className='flex min-h-screen flex-col bg-gray-50 font-outfit'>
			<Navbar />
			<div className='flex-1 flex'>
				<Sidebar />
				<div className='flex-1 overflow-y-auto p-2'>
					<Outlet />
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Educator;