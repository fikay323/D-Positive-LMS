import React from 'react'
import Hero from '../../Component/Student/Hero'
import Companies from '../../Component/Student/Companies'
import CoursesSection from '../../Component/Student/CoursesSection'
import CallToAction from '../../Component/Student/CallToAction'
import Footer from '../../Component/Student/Footer'




const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center overflow-hidden'>
      <Hero />
      <Companies />
      <CoursesSection />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default Home
