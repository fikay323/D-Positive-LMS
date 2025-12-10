import { ArrowRight } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'


const CallToAction = () => {
  const user = useUser();

  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-28 px-8 md:px-0'>
        <h1 className='text-xl md:text-4xl font-extrabold text-gray-950 mb-2'>Learn Anything, Anytime, Anywhere</h1>
        <p className='text-sm md:text-base sm:text-sm text-gray-700'>Learn from the best anything, anytime, anywhere. Here at the D-Positive. We offer Top-notch and <br /> Exclusive skills to you anytime and anywhere.</p>
        <div className='flex items-center gap-6 mt-1 '>
          { !user.isSignedIn && 
            <button className='bg-blue-700 font-bold px-10 py-3 rounded-md text-white'>Get Started</button>
          }
          <button className='  font-medium  text-black'> <a className='flex items-center gap-3' href="https://dpositiveglobalconsult.com"> Learn More <ArrowRight className=''/> </a> </button>
        </div>
      
    </div>
  )
}

export default CallToAction
