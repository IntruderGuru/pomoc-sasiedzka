import { Navigate, Outlet } from "react-router-dom";


export const PrivateRoute = () => {
    const user = null;

    if (false) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
