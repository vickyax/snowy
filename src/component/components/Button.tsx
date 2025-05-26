import React from "react";

interface ButtonProps {
  primary?: boolean;
  secondary?: boolean;
  green?: boolean;
  blue?: boolean;
  center?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  primary = true,
  secondary = false,
  green = false,
  blue = false,
  center = true,
  onClick = () => {},
  children = "Click me!",
}) => {
  if (secondary) primary = false;

  return (
    <div className={`${center ? "flex items-center justify-center" : ""}`}>
      <button
        onClick={onClick}
        className={`
          ${primary ? "text-gray-800 bg-white" : ""}
          ${secondary ? "text-gray-50 gradient" : ""}
          ${green ? "text-gray-50 greeny" : ""}
          ${blue ? "text-white bluey" : ""}
          mx-auto lg:mx-0 hover:underline font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out
        `}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
