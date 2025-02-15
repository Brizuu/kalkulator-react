
import './style.css'
import RegisterPage from "./Components/RegisterPage.jsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HomePage from "./Components/HomePage.jsx";
import LoginPage from "./Components/LoginPag.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import {ToastContainer} from "react-toastify";

function App() {

  return (
    <>
        {/*<RegisterPage />*/}
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<HomePage />} />
                </Route>
            </Routes>
        </Router>

        <ToastContainer
            position="top-right"
            autoClose={3000}
        />
    </>
  )
}

export default App
