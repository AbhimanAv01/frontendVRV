import React, { useState, useEffect } from "react";
import axios from "axios";

const EditUser = ({ isOpen, onClose, user, refreshUsers }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [access, setAccess] = useState({
    Admin: false,
    "Data Export": false,
    "Data Import": false,
  });
  const [error, setError] = useState("");

  const placeholderImage = "https://via.placeholder.com/150"; // Placeholder image URL

  // Populate form fields when the user changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setProfileImage(user.profileImage || placeholderImage);
      setAccess({
        Admin: user.access.includes("Admin"),
        "Data Export": user.access.includes("Data Export"),
        "Data Import": user.access.includes("Data Import"),
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure name and email are provided
    if (!name || !email) {
      setError("Name and Email are required");
      return;
    }

    // Filter selected access roles based on checkboxes
    const selectedAccess = Object.keys(access).filter((role) => access[role]);

    try {
      // Send PUT request to update the user details
      const response = await axios.put(`http://localhost:5000/api/users/${user._id}`, {
        name,
        email,
        profileImage: profileImage || placeholderImage,
        access: selectedAccess,
      });

      // Log the response for debugging
      console.log(response.data);

      if (response.status === 200) {
        // Refresh user list and close the modal
        refreshUsers();
        onClose();
      } else {
        setError("Failed to update user. Please try again.");
      }
    } catch (err) {
      // Log the error for debugging
      console.error(err.response || err);

      setError(
        err.response?.data?.message || "Failed to update user. Please try again."
      );
    }
  };

  const handleAccessChange = (role) => {
    setAccess((prevAccess) => {
      console.log(prevAccess); // Log the previous access state
      return {
        ...prevAccess,
        [role]: !prevAccess[role],
      };
    });
  };

  if (!isOpen) return null; // Don't render the modal if isOpen is false

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Edit User</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
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
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
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
            <label htmlFor="profileImage" className="block text-sm font-semibold text-gray-700">
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
