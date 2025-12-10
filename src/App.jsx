import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Route, Routes, useMatch } from 'react-router-dom'

import { UserService } from './services/userService.js'
import Navbar from './Component/Student/Navbar.jsx'
import Home from './Pages/Student/Home.jsx'
import CoursesList from './Pages/Student/CoursesList.jsx'
import CourseDetails from './Pages/Student/CourseDetails.tsx'
import MyEnrollments from './Pages/Student/MyEnrollments.js'
import Player from './Pages/Student/Player.tsx'
import Loading from './Component/Student/Loading.jsx'
import Educator from './Pages/Educator/Educator.tsx'
import Dashboard from './Pages/Educator/Dashboard.jsx'
import AddCourse from './Pages/Educator/AddCourse.js'
import StudentEnrolled from './Pages/Educator/StudentEnrolled.jsx'
import MyCourses from './Pages/Educator/MyCourses.tsx'
import AdminRoute from './Component/Educator/AdminRoute.js'
import EnrollStudent from './Pages/Educator/EnrollStudent.js'



const App = () => {
	const isEducatorRoute = useMatch('/educator/*')
	const { user, isLoaded, isSignedIn } = useUser();

	useEffect(() => {
		if (isLoaded && isSignedIn && user) {
			UserService.syncUser(user);
		}
	}, [isLoaded, isSignedIn, user]);

	return (
		<div className='text-default min-h-screen bg-white'>
			{!isEducatorRoute && <Navbar />}

			<Routes >
				<Route path='/' element={<Home />} />
				<Route path='/course-list' element={<CoursesList />} />
				<Route path='/course-list/:input' element={<CoursesList />} />
				<Route path='/course/:id' element={<CourseDetails />} />
				<Route path='/my-enrollment' element={<MyEnrollments />} />
				<Route path='/course/:courseId/player' element={<Player />} />
				<Route path='/loading/:path' element={<Loading />} />
				<Route path='/educator' element={<Educator />}>
					<Route path='educator' element={<Dashboard />} />
					<Route path='add-course' element={<AddCourse />} />
					<Route path='my-courses' element={<MyCourses />} />
					<Route path='student-erolled' element={<StudentEnrolled />} />
				</Route>
				<Route element={<AdminRoute />}>
					<Route path='/educator' element={<Educator />}>
						<Route index element={<MyCourses />} />
						<Route path='add-course' element={<AddCourse />} />
						<Route path='edit-course/:courseId' element={<AddCourse />} />
						<Route path='enroll-student' element={<EnrollStudent />} />
					</Route>
				</Route>
			</Routes>
		</div>
	)
}

export default App
