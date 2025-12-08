import React from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../../Component/Educator/Sidebar.js';
import Navbar from '../../Component/Educator/Navbar.js';
import Footer from '../../Component/Educator/Footer.js';

const Educator: React.FC = () => {
  return (
    <div className='flex min-h-screen bg-gray-50 font-outfit'>
      
      {/* 1. Sidebar (Fixed Left) */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className='flex-1 flex flex-col'>
        
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Page Content (This is where MyCourses or AddCourse appears) */}
        <div className='flex-1 overflow-y-auto p-2'>
            <Outlet />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Educator;