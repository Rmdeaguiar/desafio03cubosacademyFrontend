import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { getItem } from './utils/storage';

import { Routes, Route, Outlet, Navigate } from 'react-router-dom'



function ProtectedRoutes({ redirectTo }) {
    const isAuthenticated = true;
    //getItem('token');

    return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />
}

function MainRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />


            <Route element={<ProtectedRoutes redirectTo='/' />}>
                <Route path="/home" element={<Home />} />
            </Route>
        </Routes>

    );
}

export default MainRoutes;