import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { request } from "../../utilities/request"

function Signin({ url, forgot_url, destination }) {
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const signin = useRef(null);
    const password = useRef(null);

    useEffect(() => {
        request("/sanctum/csrf-cookie", setData);
    }, []);

    return (<>
        <div className="container-fluid page-body-wrapper full-page-wrapper">
            <div className="row w-100 m-0">
                <div className="content-wrapper full-page-wrapper d-flex align-items-center auth login-bg">
                    <div className="card col-lg-4 mx-auto">
                        <div className="card-body px-5 py-5">
                            <h3 className="card-title text-left mb-3">Signin</h3>
                            <form ref={signin} onSubmit={e => e.preventDefault()}>
                                <div className="form-group">
                                    <label>Email Address or Phone Number</label>
                                    <input type="text" name="email_or_phone" className="form-control p_input" />
                                    <div className="text-danger">{(data?.errors?.email_or_phone != undefined) ? data.errors.email_or_phone[0] : ""}</div>
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input ref={password} type="password" name="password" className="form-control p_input" />
                                    <div className="text-danger">{(data?.errors?.password != undefined) ? data.errors.password[0] : ""}</div>
                                </div>
                                {(forgot_url != "") ? <div className="form-group d-flex align-items-center justify-content-between">
                                    <Link to={forgot_url} className="forgot-pass">Forgot password</Link>
                                </div> : ""}
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary btn-block enter-btn" name="signin" value="Signin" onClick={e => {
                                        const formdata = new FormData(signin.current, e.target);
                                        password.current.value = "";
                                        request(url, setData, "post", formdata, e)
                                            .then(data => {
                                                if (data?.error != undefined) {
                                                    alert(data.error);
                                                }
                                                if (data?.status === "success") {
                                                    signin.current.reset();
                                                    navigate(destination);
                                                }
                                            });
                                    }}>Signin</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* content-wrapper ends */}
            </div>
            {/* row ends */}
        </div>
        {/* page-body-wrapper ends */}
    </>)
}

export default Signin
