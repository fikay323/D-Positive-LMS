import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Add Course', path: '/educator/add-course', icon: 'M12 4v16m8-8H4' },
    { name: 'My Courses', path: '/educator/my-courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Student List', path: '/educator/student-enrolled', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  return (
    <div className='md:w-64 w-16 bg-white border-r border-gray-200 min-h-screen flex flex-col'>
        <div className='p-4 border-b border-gray-200'>
             {/* Logo Placeholder */}
             <h1 className='text-2xl font-bold text-blue-600 hidden md:block'>EduLMS</h1>
             <h1 className='text-2xl font-bold text-blue-600 md:hidden'>E</h1>
        </div>

        <ul className='flex-1 py-4'>
            {menuItems.map((item) => (
                <li key={item.name}>
                    <NavLink 
                        to={item.path}
                        end={item.path === '/educator'}
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