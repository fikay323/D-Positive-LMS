import React from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';

const Navbar: React.FC = () => {
  const { user } = useUser();
  return (
    <div className='h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8'>
        <h2 className='text-lg font-semibold text-gray-700'>Educator Panel</h2>
        <div className='flex items-center gap-4'>
            <span className='text-sm text-gray-600 hidden md:block'>Hi, {user ? user.firstName : 'Instructor'}</span>
            <UserButton />
        </div>
    </div>
  );
};

export default Navbar;