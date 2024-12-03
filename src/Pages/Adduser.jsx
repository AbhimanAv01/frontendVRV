import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddUser = ({ isOpen, onClose, refreshUsers }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [profileImage, setProfileImage] = useState(""); // New state for profile image URL
  const [access, setAccess] = useState({
    Admin: false,
    "Data Export": false,
    "Data Import": false,
  });
  const [error, setError] = useState("");

  const placeholderImage = "https://via.placeholder.com/150"; // Placeholder image URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure name and email are provided
    if (!name || !email || !password) {
      setError("Name and Email are required");
      return;
    }

    // Filter selected access roles based on checkboxes
    const selectedAccess = Object.keys(access).filter((role) => access[role]);

    try {
      // Send request to the server to add the new user
      await axios.post("https://backendvrv.onrender.com/api/users", {
        name,
        email,
        password,
        profileImage: profileImage || placeholderImage, // Use the provided profileImage or placeholder
        access: selectedAccess,
      });
      toast.success("User Added Successfully");
      // Reset form
      setName("");
      setEmail("");
      setpassword("");
      setProfileImage("");
      setAccess({
        Admin: false,
        "Data Export": false,
        "Data Import": false,
      });
      setError(""); 
      onClose(); 
      refreshUsers(); 
    } catch (err) {
      setError("Failed to add user. Please try again.");
    }
  };

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Add New User</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter name"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter email"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              password
            </label>
            <input
              id="password"
              type="text"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter password"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="profileImage"
              className="block text-sm font-semibold text-gray-700"
            >
              Profile Image URL
            </label>
            <input
              id="profileImage"
              type="text"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter profile image URL (optional)"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Access Roles
            </label>
            <div className="flex flex-col space-y-2">
              {["Admin", "Data Export", "Data Import"].map((role) => (
                <label key={role} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={access[role]}
                    onChange={() =>
                      setAccess((prev) => ({ ...prev, [role]: !prev[role] }))
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span>{role}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose} 
              className="bg-gray-300 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
