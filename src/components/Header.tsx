import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { toast } from "sonner";
import { setToken, setUser } from "@/redux/authSlice";
import { RootState } from "@/redux/store";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth?.user ?? null);
  const dispatch = useDispatch();

  // Function to handle logout
  const handleLogout = () => {
    dispatch(setUser(null));
    dispatch(setToken(null));
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Successfully logged out!");
  };

  // Create a profile image based on the first letter of the first name or email
  const createProfileImage = (user: any) => {
    const name = user?.firstName || user?.email;
    const firstLetter = name?.charAt(0).toUpperCase();
    return firstLetter;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-800"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Link to='/' className="text-xl font-bold text-gray-800">Journey Showcase Management</Link>
          </div>

          {/* User Profile and Logout */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold">
                  {createProfileImage(user)}
                </div>
             
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md w-40 p-2 border border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-500 hover:bg-gray-100 p-2 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-gray-800">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
