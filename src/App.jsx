import React from 'react'
import Navbar from './Component/Student/Navbar'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './Pages/Student/Home'
import CoursesList from './Pages/Student/CoursesList'
import CourseDetails from './Pages/Student/CourseDetails'
import MyEnrollement  from './Pages/Student/MyEnrollement'
import Player from './Pages/Student/Player'
import Loading from './Component/Student/Loading'
import Educator from './Pages/Educator/Educator'
import Dashboard from './Pages/Educator/Dashboard'
import AddCourse from './Pages/Educator/AddCourse'
import MyCourse from './Pages/Educator/MyCourse'
import StudentEnrolled from './Pages/Educator/StudentEnrolled'



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
         <Route path='/player/:courseId' element = {<Player />}/>
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
