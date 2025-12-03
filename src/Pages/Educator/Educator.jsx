import React from 'react'
import { Outlet } from 'react-router-dom'

const Educator = () => {
  return (
    <div>
      <h1 className='text-3xl text-cyan-950'>Educator</h1>
      <div>
        {<Outlet />}
        <button className='bg-blue-700 text-amber-50 px-5 py-3 rounded-full'>Action to text</button>
      </div>
    </div>
  )
}

export default Educator
