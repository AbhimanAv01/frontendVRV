import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
  
      const data = response.data;  // Axios already parses the response to JSON
      if (data?.access?.includes("Admin")) {
        // Store JWT token and username in local storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username); 
        toast.success("Login successful!")
        navigate("/dashboard"); // Redirect to the admin dashboard
        setSuccess("Login successful!");
      
        setError(""); // Clear previous errors
      } else {
        // Store JWT token and username in local storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username); 
  
        navigate("/userdashboard"); // Redirect to the user dashboard
        setSuccess("Login successful!");
        setError(""); // Clear previous errors
      }
    } catch (err) {
      // Handle errors from the server
      setError(err.response?.data?.error || "Login failed");
      toast.error("Please Check Credentials")
      setSuccess(""); // Clear previous success messages
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };



  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4"
      style={{
        backgroundImage:
          'url("https://res.cloudinary.com/dt8emxboh/image/upload/v1733221481/ckelp2ks0l9qcvf2xv62.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Left Section: Illustration */}
      <div className="lg:w-1/2 w-full flex items-center justify-center mb-10 lg:mb-0">
        <img
          src="https://res.cloudinary.com/dt8emxboh/image/upload/v1733220855/pdbplsahj6zcheajon41.png"
          alt="Illustration"
          className="w-full gra"
        />
      </div>

      {/* Right Section: Login Form */}
      <div className="lg:w-1/2 w-full bg-white rounded-lg shadow-md p-8 max-w-md md:ml-48">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Welcome
        </h2>
        <ToastContainer />

        <p className="text-gray-600 text-center mb-6">
          Please sign in to your account
        </p>
        <form className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 text-left"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              placeholder="Example@gmail.com"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password Input with Visibility Toggle */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 text-left"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 px-3 flex items-center"
              >
                <img
                  src={
                    passwordVisible
                      ? "http://res.cloudinary.com/dt8emxboh/image/upload/v1722701799/d5bfgfaizqn7oowzjuzj.png"
                      : "http://res.cloudinary.com/dt8emxboh/image/upload/v1722701763/lvbdyeotvq2qwnk32zn7.png"
                  }
                  alt="Toggle Password Visibility"
                  className="h-6 w-6"
                />
              </button>
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="/" className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-800 text-white font-medium py-2 rounded-md"
          >
            Login
          </button>
        </form>

        {/* Create Account Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          New on our platform?{" "}
          <a href="/" className="text-blue-500 hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
