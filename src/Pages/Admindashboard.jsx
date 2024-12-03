import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import AddUser from "./Adduser";
import EditUser from "./Edituser";
import Edituserpermissions from "./Edituserpermissions";
import DeleteUser from "./Deleteuser";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Admindashboard = () => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditpermissionModalOpen, setIseditpermissionModalOpen] =
    useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isActive, setIsActive] = useState();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized access");
      navigate("/");
      return;
    }

    // Fetch users data
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://backendvrv.onrender.com/api/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [token, navigate]);

  // Search
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
    toggleMenu();
  };

  const handleChangePermissions = (user) => {
    setSelectedUser(user);
    setIseditpermissionModalOpen(true);
    toggleMenu();
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
    toggleMenu();
  };

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const refreshUsers = async () => {
    try {
      const response = await axios.get(
        "https://backendvrv.onrender.com/api/users"
      );
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to refresh users", err);
    }
  };

  const sortUsers = (users) => {
    switch (sortOption) {
      case "A-Z":
        return [...users].sort((a, b) => a.name.localeCompare(b.name));
      case "Z-A":
        return [...users].sort((a, b) => b.name.localeCompare(a.name));
      case "date-newest":
        return [...users].sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
        );
      case "date-oldest":
        return [...users].sort(
          (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)
        );
      default:
        return users;
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://backendvrv.onrender.com/api/users"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const toggleactivebutton = (userId) => {
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  const toggleUserStatus = async (userId) => {
    try {
      // Make sure userId is a string
      if (typeof userId !== "string") {
        throw new Error("Invalid userId");
      }

      const response = await axios.put(
        `https://backendvrv.onrender.com/${userId}/toggle-status`,
        {}
      );
      setUsers((prevUsers) =>
        prevUsers.map(
          (user) =>
            user._id === userId
              ? { ...user, isActive: response.data.isActive } // Update only the affected user
              : user // Keep the rest of the users unchanged
        )
      );
      setOpenMenuId(openMenuId === userId ? null : userId);
      setIsActive(response.data.isActive);

      toast.success("User status updated successfully!");
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      toast.error("Failed to update user status.");
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-4 md:p-8"
      style={{
        backgroundImage:
          'url("https://res.cloudinary.com/dt8emxboh/image/upload/v1733221481/ckelp2ks0l9qcvf2xv62.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <p className="inline md:text-3xl font-bold text-black">
            {getGreeting()},{" "}
          </p>
          <h1 className="md:text-3xl font-bold text-gray-800">
            {`  ${username}`}
          </h1>

          <div className="ml-auto">
            <button
              className="bg-black text-white px-4 py-2 rounded-md mt-4"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          Manage your team members and their account permissions here.
        </p>

        {/* Search and Filters */}
        <div className=" md:block hidden">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 ">
            <div className="mb-2 md:mb-0">
              <span className="text-sm text-gray-600">
                All users{" "}
                <span className="font-bold">{filteredUsers.length}</span>
              </span>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none w-full md:w-40"
              />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md w-full md:w-40"
              >
                <option value="">Sort by</option>
                <option value="A-Z">Name (A-Z)</option>
                <option value="Z-A">Name (Z-A)</option>
                <option value="date-newest">Date (Newest)</option>
                <option value="date-oldest">Date (Oldest)</option>
              </select>
              <button
                className="bg-black text-white px-4 py-2 rounded-md w-full md:w-auto"
                onClick={handleOpenModal}
              >
                + Add user
              </button>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-lg shadow-md ">
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left md:block hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">User name</th>
                  <th className="px-4 py-2 ">Access</th>
                  <th className="px-4 py-2 w-1/6">Status</th>
                  <th className="px-4 py-2 w-1/6">Date added</th>
                  <th className="mr-3 py-2">Options</th>
                </tr>
              </thead>
              <tbody>
                {sortUsers(filteredUsers).map((user, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition duration-150 relative"
                  >
                    <td className="px-4 py-2 flex items-center">
                      <img
                        src={
                          user.image
                            ? user.image
                            : "https://via.placeholder.com/150"
                        }
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover mr-4"
                      />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-gray-600 text-sm">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {user.access.map((access, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-1 rounded-full ${
                            access === "Admin"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          } mr-2`}
                        >
                          {access}
                        </span>
                      ))}
                    </td>

                    {/* Active/Inactive Toggle */}
                    <td className="px-4 py-2">
                      <label
                        key={user._id}
                        className="relative inline-flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={user.isActive}
                          onChange={() => toggleUserStatus(user._id)} // Pass the userId correctly
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-4 peer-focus:ring-green-300 transition-all`}
                        ></div>
                        <span
                          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out ${
                            user.isActive ? "translate-x-5" : ""
                          }`}
                        ></span>
                      </label>
                    </td>
                    <td className="px-4 py-2">{user.dateAdded}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        className="text-gray-700 hover:text-black focus:outline-none"
                        onClick={() => toggleMenu(index)}
                      >
                        &#x2022;&#x2022;&#x2022;
                      </button>
                      {openMenuIndex === index && (
                        <div className="absolute right-4 bg-white border rounded-lg shadow-md w-40 z-10">
                          <ul className="py-2 text-sm text-gray-700 text-start">
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleEditUser(user)}
                            >
                              Edit details
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleChangePermissions(user)}
                            >
                              Change permission
                            </li>

                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex"
                              onClick={() => handleDeleteUser(user)}
                            >
                              Delete User
                              <img
                                src="https://res.cloudinary.com/dt8emxboh/image/upload/v1733134561/uy5p2psok98tbxy7nux6.png"
                                alt=""
                                srcSet=""
                                className="ml-8 mt-1 h-4"
                              />
                            </li>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile View - Table as Columns */}
            <div className="block md:hidden">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <div className="mb-2 md:mb-0">
                  <span className="text-sm text-gray-600">
                    All users{" "}
                    <span className="font-bold">{filteredUsers.length}</span>
                  </span>
                </div>
                <div className="gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:outline-none w-full md:w-40"
                  />
                  <div className="flex  justify-between mt-6">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md w-40"
                    >
                      <option value="">Sort by</option>
                      <option value="A-Z">Name (A-Z)</option>
                      <option value="Z-A">Name (Z-A)</option>
                      <option value="date-newest">Date (Newest)</option>
                      <option value="date-oldest">Date (Oldest)</option>
                    </select>
                    <button
                      className="bg-black text-white px-4 py-2 rounded-md w-40 md:w-auto"
                      onClick={handleOpenModal}
                    >
                      + Add user
                    </button>
                  </div>
                </div>
              </div>

              {sortUsers(filteredUsers).map((user, index) => (
                <div
                  key={index}
                  className="border-t p-4 hover:bg-gray-50 transition duration-150 relative"
                >
                  <div className="flex items-center justify-between">
                    <img
                      src={
                        user.image
                          ? user.image
                          : "https://via.placeholder.com/150"
                      }
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-gray-600 text-sm">{user.email}</div>
                    </div>
                    {/* Active/Inactive Toggle */}
                    <div className="px-4 py-2 ">
                      <label
                        key={user._id}
                        className="relative inline-flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={user.isActive}
                          onChange={() => toggleUserStatus(user._id)}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-4 peer-focus:ring-green-300 transition-all`}
                        ></div>
                        <span
                          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out ${
                            user.isActive ? "translate-x-5" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-2">
                    <strong>Access:</strong>
                    {user.access.map((access, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-1 rounded-full ${
                          access === "Admin"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        } mr-2`}
                      >
                        {access}
                      </span>
                    ))}
                  </div>

                  <div className="mt-2">
                    <strong>Last active:</strong> {user.lastActive}
                  </div>
                  <div className="mt-2">
                    <strong>Date added:</strong> {user.dateAdded}
                  </div>
                  <div className="mt-2 text-center">
                    <button
                      className="text-gray-700 hover:text-black focus:outline-none"
                      onClick={() => toggleMenu(index)}
                    >
                      &#x2022;&#x2022;&#x2022;
                    </button>
                    {openMenuIndex === index && (
                      <div className="absolute right-4 bg-white border rounded-lg shadow-md w-40 z-10">
                        <ul className="py-2 text-sm text-gray-700 text-start">
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleEditUser(user)}
                          >
                            Edit details
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleChangePermissions(user)}
                          >
                            Change permission
                          </li>

                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex"
                            onClick={() => handleDeleteUser(user)}
                          >
                            Delete User
                            <img
                              src="https://res.cloudinary.com/dt8emxboh/image/upload/v1733134561/uy5p2psok98tbxy7nux6.png"
                              alt=""
                              srcSet=""
                              className="ml-8 mt-1 h-4"
                            />
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddUser
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        refreshUsers={refreshUsers}
      />

      <EditUser
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        refreshUsers={refreshUsers}
      />

      <Edituserpermissions
        isOpen={isEditpermissionModalOpen}
        onClose={() => setIseditpermissionModalOpen(false)}
        user={selectedUser}
        refreshUsers={refreshUsers}
      />
      <DeleteUser
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        user={selectedUser}
        refreshUsers={refreshUsers}
      />
    </div>
  );
};

export default Admindashboard;
