import React, { useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({data}) => {

  const navigate = useNavigate()
const [input, setInput] = useState(data ? data : '')

const onSearchHandler = (e) => {
  e.preventDefault()
  navigate('/course-list/' + input)
}

  return (
       <form onSubmit={onSearchHandler} className='max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-900/20 rounded'>
        <SearchIcon className='md:w-auto w-10 px-3 font-light' />
        <input
          onChange={e => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Search for courses"
          className="w-full h-full text-gray-950 outline-none"
        />
        <button className='bg-blue-800 rounded-md text-white md:px-10 px-7 md:py-3 py-2 mx-1 font-extrabold'>Search</button>
       </form>
  )
}

export default SearchBar
