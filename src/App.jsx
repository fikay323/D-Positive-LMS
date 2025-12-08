import React from 'react'
import Navbar from './Component/Student/Navbar.jsx'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './Pages/Student/Home.jsx'
import CoursesList from './Pages/Student/CoursesList.jsx'
import CourseDetails from './Pages/Student/CourseDetails.jsx'
import MyEnrollement  from './Pages/Student/MyEnrollement.jsx'
import Player from './Pages/Student/Player.tsx'
import Loading from './Component/Student/Loading.jsx'
import Educator from './Pages/Educator/Educator.jsx'
import Dashboard from './Pages/Educator/Dashboard.jsx'
import AddCourse from './Pages/Educator/AddCourse.jsx'
import MyCourse from './Pages/Educator/MyCourse.jsx'
import StudentEnrolled from './Pages/Educator/StudentEnrolled.jsx'



const App = () => {
  const isEducatorRoute = useMatch('/educator/*')

  return (
    <div className='text-default min-h-screen bg-white'>
      { !isEducatorRoute && <Navbar />}
      
      <Routes >
        <Route path='/' element={<Home />}/>
        <Route path='/course-list' element = {<CoursesList />}/>
         <Route path='/course-list/:input' element = {<CoursesList />}/>
        <Route path='/course/:id' element = {<CourseDetails />}/>
        <Route path='/my-enrollment' element = {<MyEnrollement />}/>
         <Route path='/course/:courseId/player' element = {<Player />}/>
        <Route path='/loading/:path' element = {<Loading />}/>
        <Route path='/educator' element={<Educator />}>
          <Route path='educator' element={<Dashboard />}/>
          <Route path='add-course' element={<AddCourse />}/>
          <Route path='my-course' element={<MyCourse />}/>
          <Route path='student-erolled' element={<StudentEnrolled />}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
