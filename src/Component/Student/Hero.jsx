import React from 'react'
import Sktech from '../../assets/sktech.png'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full  md:pt-36 pt-20 px-4 md:px-0 space-y-7 text-center bg-gradient-to-b  from-green-200/70'>
      <h1 className='md:text-home-heading-large text-home-heading-large lg:text-4xl text-3xl relative font-extrabold text-gray-950 max-w-3xl mx-auto'>Re-Invention Intrapreneurship Certification for 21st Century Impact to <span className='text-blue-600 lg:text-4xl text-3xl'>fit your choices. <img src={Sktech} alt="sketch" className='w-48 md:block hidden absolute top-36 right-20 md:top-18 md:right-40 lg:top-19 lg:right-5' /></span></h1>

        <p className='md:block hidden text-gray-800 text-xl max-w-2xl mx-auto'>Empower Your Future with the courses designed to fit your choices and align with your potentials ....</p>

        <SearchBar />
    </div>
  )
}

export default Hero
