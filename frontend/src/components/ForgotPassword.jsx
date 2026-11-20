import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { request } from "../utilities/request"

function ForgotPassword() {
    const [data, setData] = useState({});
    const [blocked, setBlocked] = useState(false);
    const da = useRef({});
    const navigate = useNavigate();
    const forgot = useRef(null);
    const email = useRef("");
    const signin_url = "/admin_signin";
    const url = "/forgot_password";

    if (blocked) {
        setTimeout(() => {
            setBlocked(false);
        }, 60000);
    }

    if (data?.forgot != undefined || data?.verify != undefined || data?.change != undefined) {
        da.current = data;
    }

    function execute(e) {
        const formdata = new FormData(forgot.current, e.target);
        if (email.current != "") {
            formdata.set("email", email.current);
        }
        forgot.current.reset();
        request(url, setData, "post", formdata, e)
            .then(data => {
                if (data?.error != undefined) {
                    da.current = {};
                    alert(data.error);
                }
                if (data?.forgot === "passed" && data?.email != undefined) {
                    email.current = data.email;
                    setBlocked(true);
                }
                if (data?.change === "passed") {
                    navigate(signin_url);
                }
            });
    }

    useEffect(() => {
        request("/sanctum/csrf-cookie", setData);
    }, []);

    return (<>
        <div className="container-fluid page-body-wrapper full-page-wrapper">
            <div className="row w-100 m-0">
                <div className="content-wrapper full-page-wrapper d-flex align-items-center auth login-bg">
                    <div className="card col-lg-4 mx-auto">
                        <div className="card-body px-5 py-5">
                            <h3 className="card-title text-left mb-3">Forgot Password</h3>
                            <p>Reset your password</p>
                            <form ref={forgot} onSubmit={e => e.preventDefault()}>
                                {(da.current?.forgot === undefined && da.current?.verify === undefined && da.current?.change === undefined) && <>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input type="text" name="email" className="form-control p_input" />
                                        <div className="text-danger">{(data?.errors?.email != undefined) ? data.errors.email[0] : ""}</div>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary btn-block enter-btn" name="forgot" value="Forgot" onClick={e => {
                                            execute(e);
                                        }}>Send Verification Code</button>
                                    </div>
                                </>}
                                {(da.current?.forgot === "passed" && da.current?.verify === undefined && da.current?.change === undefined) && <>
                                    <div className="form-group">
                                        <label>Check your inbox or spam folder for verification code</label>
                                        <input type="text" name="code" className="form-control p_input" />
                                        <div className="text-danger">{(data?.errors?.code != undefined) ? data.errors.code[0] : ""}</div>
                                    </div>
                                    {(blocked) ? <a>Code sent, wait 60 seconds</a> : <a href="#" onClick={e => {
                                        e.preventDefault();
                                        setBlocked(true);
                                        const formdata = new FormData();
                                        formdata.set("email", email.current);
                                        formdata.set("forgot", "Forgot");
                                        request(url, setData, "post", formdata)
                                            .then(data => {
                                                if (data?.error) {
                                                    alert(data.error);
                                                }
                                            });
                                    }}>Resend code</a>}
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary btn-block enter-btn" name="verify" value="Verify" onClick={e => {
                                            execute(e);
                                        }}>Submit Verification Code</button>
                                    </div>
                                </>}
                                {(da.current?.verify === "passed" && da.current?.change === undefined) && <>
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input type="password" name="new_password" className="form-control p_input" />
                                        <div className="text-danger">{(data?.errors?.new_password != undefined) ? data.errors.new_password[0] : ""}</div>
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <input type="password" name="confirm_new_password" className="form-control p_input" />
                                        <div className="text-danger">{(data?.errors?.confirm_new_password != undefined) ? data.errors.confirm_new_password[0] : ""}</div>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary btn-block enter-btn" name="change" value="Change" onClick={e => {
                                            execute(e);
                                        }}>Change Password</button>
                                    </div>
                                </>}
                                <div className="form-group d-flex align-items-center justify-content-between">
                                    <Link to={signin_url} className="forgot-pass">Signin</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* content-wrapper ends */}
            </div>
            {/* row ends */}
        </div>
    </>)
}

export default ForgotPassword
