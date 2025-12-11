"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const FloatingLabelInput = ({
  type,
  label,
  icon: Icon,
  name,
  value,
  onChange,
  errorMessage, // New prop for error message
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === "password";

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const inputType = isPassword
    ? isPasswordVisible
      ? "text"
      : "password"
    : type;

  const inputBorderClass = errorMessage
    ? "border-red-500 focus:border-red-500"
    : "border-gray-300 focus:border-blue-500";
  const labelTextClass = errorMessage ? "text-red-500" : "text-gray-500";
  const focusLabelClass = errorMessage ? "peer-focus:text-red-500" : "peer-focus:text-blue-600";


  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        {Icon && <Icon className={`w-5 h-5 ${errorMessage ? 'text-red-500' : 'text-gray-400'}`} />}
      </div>
      <input
        type={inputType}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={`block w-full px-3.5 py-4 pl-12 text-gray-900 bg-transparent rounded-lg border-2 ${inputBorderClass} appearance-none focus:outline-none focus:ring-0 peer`}
        placeholder=" "
      />
      <label
        htmlFor={name}
        className={`absolute ${labelTextClass} duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-md px-2 peer-focus:px-2 ${focusLabelClass} peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-6.3 left-9 peer-placeholder-shown:bg-transparent peer-placeholder-shown:border-transparent peer-placeholder-shown:backdrop-blur-none`}
      >
        {label}
      </label>
      {isPassword && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 hover:text-gray-700"
        >
          {isPasswordVisible ? (
            <FaEyeSlash className="w-5 h-5" />
          ) : (
            <FaEye className="w-5 h-5" />
          )}
        </button>
      )}
      {errorMessage && (
        <p className="absolute -bottom-5 left-0 text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default FloatingLabelInput;
