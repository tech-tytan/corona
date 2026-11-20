import Signin from "./partials/Signin"

function AdminSignin() {
    const url = "/admin_signin";

    return (<Signin url={url} forgot_url={"/forgot_password"} destination={"/dashboard"} />)
}

export default AdminSignin
