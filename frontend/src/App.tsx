import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CustomThemeProvider } from "./contexts/ThemeContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <CustomThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </CustomThemeProvider>
  );
}

export default App;
