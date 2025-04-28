import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "../pages/Auth/SignIn";
import SignUp from "../pages/Auth/SignUp";
import Dash from '../pages/Dashboard/Dash';
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "../context/AuthProvider";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/*" element={<Dash />} />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
