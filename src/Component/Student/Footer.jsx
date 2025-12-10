import logo_white from '../../assets/logo_white.png'

const Footer = () => {
  return (
    <footer className='text-left w-full md:px-36 mt-10 bg-blue-900'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 py-10 md:gap-32 border-b border-white/30'>
        <div className='flex flex-col md:items-start items-center w-full'>
          <img src={logo_white} alt="logo" className='w-30'/>
          <p className='text-white mt-6 text-center md:text-left  font-bold text-xs '>At D-Positive, we are dedicated to inspiring <br /> excellence and shaping the leaders of tomorrow. </p>
        </div>
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mb-5'>Company</h2>
          <ul className='text-white md:flex-col w-full justify-between text-sm md:space-y-2 hover:cursor-pointer'>
            <li><a href="https://dpositiveglobalconsult.com/about-us/">About Us</a></li>
            <li><a href="https://dpositiveglobalconsult.com/services/">Our Services</a></li>
            <li>Blog</li>
            <li><a href="https://dpositiveglobalconsult.com/contact-us/">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <p className='text-white/60 text-xs md:text-sm py-4 text-center'> Copyright 2025 &copy; DPositive LMS. All Right Reserved  </p>
    </footer>
  )
}

export default Footer
