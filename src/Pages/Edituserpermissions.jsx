import React, { useState, useEffect } from "react";
import axios from "axios";

const Edituserpermissions = ({ isOpen, onClose, user, refreshUsers }) => {
  const [access, setAccess] = useState({
    Admin: false,
    "Data Export": false,
    "Data Import": false,
  });
  const [error, setError] = useState("");
  useEffect(() => {
    if (user) {
      setAccess({
        Admin: user.access.includes("Admin"),
        "Data Export": user.access.includes("Data Export"),
        "Data Import": user.access.includes("Data Import"),
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedAccess = Object.keys(access).filter((role) => access[role]);

    try {
      await axios.put(`http://localhost:5000/api/users/${user._id}`, {
        access: selectedAccess,
      });

      refreshUsers();
      onClose(); 
    } catch (err) {
      setError("Failed to update user permissions. Please try again.");
    }
  };

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Change User Permissions</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Access Roles</label>
            <div className="flex flex-col space-y-2">
              {["Admin", "Data Export", "Data Import"].map((role) => (
                <label key={role} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={access[role]}
                    onChange={() =>
                      setAccess((prev) => ({
                        ...prev,
                        [role]: !prev[role],
                      }))
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edituserpermissions;
