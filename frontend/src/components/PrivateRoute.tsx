import { Navigate, Outlet } from "react-router-dom";


export const PrivateRoute = () => {
    const user = null;

    if (!user || !user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
