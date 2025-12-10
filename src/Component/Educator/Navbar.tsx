import React, { useContext } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import logo from '../../assets/logo.png';
import { AppContext } from '../../Context/AppContext.js';

const Navbar: React.FC = () => {
  const { user } = useUser();
	const { navigate } = useContext(AppContext)

  return (
    <div className='bg-white border-b border-gray-200 flex items-center justify-between px-8'>
        <div className='flex gap-4 items-center'>
          <img onClick={() => navigate('/')} src={logo} alt="logo" className='h-16 xl:h-20' />
          <h2 className='text-lg font-semibold text-gray-700'>Admin Panel</h2>
        </div>
        <div className='flex items-center gap-4'>
            <span className='text-sm text-gray-600 hidden md:block'>Hi, {user ? user.firstName : 'Instructor'}</span>
            <UserButton />
        </div>
    </div>
  );
};

export default Navbar;