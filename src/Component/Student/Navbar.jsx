import React, { useContext } from 'react'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import { User } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../Context/AppContext'

const Navbar = () => {

  const {navigate, isEducator} = useContext(AppContext)


  const isCourseListPage = location.pathname.includes('/course-list')

  const {openSignIn} = useClerk()
  const {user} = useUser()

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-25 border-b border-gray-500 py-4 ${isCourseListPage ? 'bg-white' : 'bg-green-200/70'} `}>
      <img onClick={() => navigate('/')} src={logo} alt="logo" className='w-13 lg:w-28 ' />
      <div className='hidden md:flex items-center gap-5 text-gray-800 font-semibold'>
         <div className='flex items-center gap-5'>
          {user &&
           <>
            <button onClick={() => {navigate('/educator')}}>{isEducator ? 'Educator Dahboard' : 'Become Educator'}</button>
          | <Link to='/my-erollment'>My Enrollment</Link>
           </>
          }
         </div>
         {user ? <UserButton /> : 
          
          <button onClick={() => openSignIn()} className='bg-blue-700 text-white px-5 py-2 rounded-full cursor-pointer'>Create Account </button>}
      </div>

      {/*Mobile Screen  */}

      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div className='items-center gap-1 sm:gap-2 maz-sm:text-xs'>
          {user &&
           <>
             <button onClick={() => {navigate('/educator')}}>{isEducator ? 'Educator Dahboard' : 'Become Educator'}</button>
          | <Link to='/my-erollment'>My Enrollment</Link>
           </>
          }
        </div>
        {
          user ? <UserButton /> : 
          <button onClick={() => openSignIn()}>
          <User size={30} className='cursor-pointer'/>
          </button>     
          }
        
      </div>

    </div>
  )
}

export default Navbar
