import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./assets/Signup";
import Login from "./assets/Login";
import Home from "./assets/Profile";
import "bootstrap/dist/css/bootstrap.min.css";
import Adminfunction from "./adminfucntions//Adminfunction";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Home />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/admin" element={<Adminfunction />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
