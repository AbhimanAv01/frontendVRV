import React, { useState, useEffect } from "react";
import { FaDownload, FaUpload } from "react-icons/fa";
import samplepdf from "../assets/sample.pdf";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [pdfs, setPdfs] = useState([]);
  const [access, setAccess] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(access);
    const fetchUserAccess = async () => {
      try {
        const response = await axios.get("http://localhost:5000/access", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        });
        setAccess(response.data.access);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching user access:", err);
        toast.error("Failed to fetch user data. Please log in again.");
        navigate("/");
      }
    };

    fetchUserAccess();
    const defaultPdf = {
      name: "Sample PDF.pdf",
      url: samplepdf,
    };
    setPdfs([defaultPdf]);
  }, [navigate]);

  const handleUpload = (event) => {
    if (!access.includes("Data Export")) {
      toast.error("You don't have permission to access this feature.");
      return;
    }
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const newPdf = {
        name: file.name,
        url: URL.createObjectURL(file),
      };
      setPdfs([...pdfs, newPdf]);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url; 
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploaderror = () => {
    toast.error("You dont have access");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6"
    style={{
        backgroundImage:
          'url("https://res.cloudinary.com/dt8emxboh/image/upload/v1733221481/ckelp2ks0l9qcvf2xv62.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        
      }}>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">User Dashboard</h1>
        <ToastContainer />
        <div className="flex items-center mb-6">
          <p className="inline md:text-3xl font-bold text-black">
            {getGreeting()},{" "}
          </p>
          <h1 className="md:text-3xl font-bold text-gray-800">{`  ${username}`}</h1>
          <div className="ml-auto">
            <button
              className="bg-black text-white px-4 py-2 rounded-md mt-4"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        {access.includes("Data Export") ? (
          <div className="flex items-center justify-center mb-6">
            <label className="cursor-pointer flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
              <FaUpload className="text-lg" />
              <span>Upload PDF</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-center mb-6">
            <label className="cursor-pointer flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
              <FaUpload className="text-lg" />
              <span>Upload PDF</span>
              <button
                accept="application/pdf"
                onClick={handleUploaderror}
                className=" "
              />
            </label>
          </div>
        )}
        <div>
          {pdfs.length === 0 ? (
            <p className="text-gray-500 text-center">No PDFs uploaded yet.</p>
          ) : (
            <div className="space-y-4">
              {pdfs.map((pdf, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 font-medium">
                      {pdf.name}
                    </span>
                  </div>

                  {access.includes("Data Import") ? (
                    <button
                      onClick={() => handleDownload(pdf.url, pdf.name)}
                      className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
                    >
                      <FaDownload />
                      <span>Download</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleUploaderror}
                      className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
                    >
                      <FaDownload />
                      <span>Download</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
