
import { motion } from "framer-motion";

const JudgmentFleetBanner = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0 h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.04, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-[120%] max-w-7xl flex items-center justify-center"
      >
        <h1 className="text-[20vw] font-display font-bold text-jf-blue/80 whitespace-nowrap select-none">
          Judgment Fleet
        </h1>
      </motion.div>
    </div>
  );
};

export default JudgmentFleetBanner;
