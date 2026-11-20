import { useState, useRef, useEffect } from "react"
import { request } from "../utilities/request"
import { showError } from "../utilities/clear"
import AdminAuth from "./partials/AdminAuth"
import AdminNav from "./partials/AdminNav"
import AdminHeader from "./partials/AdminHeader"
import UpdateProfile from "./partials/UpdateProfile"
import ChangePassword from "./partials/ChangePassword"
import Footer from "./partials/Footer"

function Profile() {
    const [data, setData] = useState({});
    const forms = useRef(null);
    const [showPassword, setShowPassword] = useState("");
    const fname = useRef(null);
    const lname = useRef(null);
    const email = useRef(null);
    const phone = useRef(null);
    const url = "/profile";

    function setValues(data) {
        const administrator = data?.administrator;
        if (administrator != undefined) {
            fname.current.value = administrator.first_name;
            lname.current.value = administrator.last_name;
            email.current.value = administrator.email_address;
            phone.current.value = administrator.phone_number;
        }
        setData(data);
    }

    function execute(id, form, e, set, current_password) {
        if (showPassword != id) {
            setShowPassword(id);
        }
        else {
            const formdata = new FormData(form.current, e.target);
            if (id === "profile") {
                current_password.current.value = "";
            }
            else {
                form.current.reset();
            }
            request(url, set, "post", formdata, e)
                .then(data => {
                    if (data?.errors === undefined) {
                        setShowPassword("");
                        if (id === "password") {
                            alert("Password successfully changed.");
                        }
                    }
                    else {
                        showError(forms);
                    }
                });
        }
    }

    useEffect(() => {
        request(url, setValues);
    }, []);

    return (<>
        <AdminAuth status={data?.status} />
        <AdminNav />
        <div className="container-fluid page-body-wrapper">
            <AdminHeader da={data} />
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="page-header">
                        <h3 className="page-title"> Profile </h3>
                    </div>
                    <div ref={forms} className="row">
                        <UpdateProfile refs={{ fname, lname, email, phone }} data={data} setValues={setValues} execute={execute} showPassword={showPassword} />
                        <ChangePassword data={data} setData={setData} execute={execute} showPassword={showPassword} />
                    </div>
                </div>
                {/* content-wrapper ends */}
                <Footer />
            </div>
            {/* main-panel ends */}
        </div>
        {/* page-body-wrapper ends */}
    </>)
}

export default Profile
