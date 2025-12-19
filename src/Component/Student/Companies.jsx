import { trusted_companies } from "../../assets/assets.ts";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useRef } from "react";

const Companies = () => {
  const x = useMotionValue(0);
  const containerRef = useRef(null);

  const SPEED = 120; // px per second (increase = faster)

  useAnimationFrame((t, delta) => {
    const moveBy = (SPEED * delta) / 1000;
    x.set(x.get() - moveBy);

    // Reset when half content has moved
    const width = containerRef.current?.scrollWidth / 2;
    if (width && Math.abs(x.get()) >= width) {
      x.set(0);
    }
  });

  return (
    <div className="pt-16">
      <p className="text-base text-gray-900 mb-5">
        Trusted By Learners From
      </p>

      {/* CLIPPING WRAPPER */}
      <div className="overflow-hidden w-full">
        <motion.div
          ref={containerRef}
          style={{ x, willChange: "transform", transform: "translateZ(0)" }}
          className="flex items-center gap-6 md:gap-16"
        >
          {[...trusted_companies, ...trusted_companies].map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`company-${index}`}
              className={
                index % trusted_companies.length === 10
                  ? "w-50"
                  : "w-25"
              }
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Companies;
