import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  image?: string;
  content1?: string;
  content2?: string;
  link?: string;
}

const Card: React.FC<CardProps> = ({
  image = "default.jpg",
  content1 = "Default content",
  content2 = "Default content",
  link = "/TechService/default",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full max-w-[300px] bg-white/60 rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
    >
        <button
        
         className="flex p-4">

          {/* Text Content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-bold text-sm text-gray-800"
            >
              {content1}
            </motion.div>
          </div>
        </button>
    </motion.div>
  );
};

export default Card;
