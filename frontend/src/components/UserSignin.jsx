import Signin from "./partials/Signin"

function UserSignin() {
    const url = "/user_signin";

    return (<Signin url={url} forgot_url="" destination={"/sales"} />)
}

export default UserSignin
