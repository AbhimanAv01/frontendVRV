import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Admindashboard from "./Pages/Admindashboard";
import AddUser from "./Pages/Adduser";
import EditUser from "./Pages/Edituser";
import Edituserpermissions from "./Pages/Edituserpermissions";
import UserDashboard from "./Pages/Userdashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Define Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Admindashboard />} />
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/edituser" element={<EditUser />} />
        <Route path="/edituserpermissions" element={<Edituserpermissions/>} />
        <Route path="/Userdashboard" element={<UserDashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;
