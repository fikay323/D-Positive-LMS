import { trusted_companies } from "../../assets/assets.ts";
import { motion } from 'framer-motion';

const Companies = () => {
  return (
    <div
      className="pt-16 scroll-smooth">
      <p className="text-base text-gray-900">Trusted By Learners From</p>
      <motion.div 
       animate={{ x: ["-112%", "5%", "112%"] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{ willChange: "transform" }}
      className="flex flex-row overflow-hidden md:overflow-hidden items-center justify-center gap-6 md:gap-16 md:mt-10 mt-5">
  {trusted_companies.map((src, index) => {
    if (index === 5 || index === 6) {
      return (
        <img
          key={src}
          src={src}
          alt={`${index}`}
          className='w-25'
        />
      );
    }

    return (
      <img
        key={index}
        src={src}
        alt={`${index}`}
        className='w-25'
      />
    );
  })}
</motion.div>

    </div>
  );
};

export default Companies;
