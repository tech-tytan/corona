import { Navigate } from "react-router"

function AdminAuth({ status }) {

    if (status != undefined && status === "failed") {
        return (<Navigate to="/admin_signin" />)
    }
    else {
        return null;
    }
}

export default AdminAuth
