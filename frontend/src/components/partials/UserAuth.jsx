import { Navigate } from "react-router"

function UserAuth({ status }) {

    if (status != undefined && status === "failed") {
        return (<Navigate to="/signin" />)
    }
    else {
        return null;
    }
}

export default UserAuth
