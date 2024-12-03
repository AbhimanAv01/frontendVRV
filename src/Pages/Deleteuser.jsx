import React, { useState } from "react";
import axios from "axios";

const DeleteUser = ({ isOpen, onClose, user, refreshUsers }) => {
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setError(""); 
    try {
      await axios.delete(`http://localhost:5000/api/users/${user._id}`);
      refreshUsers(); 
      onClose(); 
    } catch (err) {
      console.error(err); 
      setError("Failed to delete user. Please try again."); 
    }
  };

  if (!isOpen) return null; 
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Delete User</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <p className="text-sm text-gray-700">
          Are you sure you want to delete the user "{user.name}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete} 
            className="bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;
