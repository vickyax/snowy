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
      className="w-full max-w-[300px] bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
    >
    <a href={`/TechService/${link}`}>
        <button
        
         className="flex p-4">
          {/* Image */}
          <motion.img
            src={image}
            alt={content1}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="h-16 w-16 rounded-lg mr-4 object-cover"
          />

          {/* Text Content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-bold text-lg text-gray-800"
            >
              {content1}
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 text-base mt-1"
            >
              {content2}
            </motion.p>
          </div>
        </button>
        </a>
    </motion.div>
  );
};

export default Card;
