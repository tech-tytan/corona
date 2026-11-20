import { useState, useRef, useEffect } from "react"
import { useParams } from "react-router"
import { request } from "../../utilities/request"
import AdminNav from "./AdminNav"
import AdminHeader from "./AdminHeader"
import Back from "./Back"
import UpdateProfile from "./UpdateProfile"
import ChangePassword from "./ChangePassword"
import Footer from "./Footer"

function EditUser() {
    const [data, setData] = useState({});
    const { id } = useParams();
    const fname = useRef(null);
    const lname = useRef(null);
    const email = useRef(null);
    const phone = useRef(null);
    const url = "/users";

    function setValues(data) {
        const user = data?.user;
        if (user != undefined) {
            fname.current.value = user.first_name;
            lname.current.value = user.last_name;
            email.current.value = user.email_address;
            phone.current.value = user.phone_number;
        }
        setData(data);
    }

    function execute(fid, form, e, set) {
        const formdata = new FormData(form.current, e.target);
        formdata.set("_method", "PUT");
        if (fid === "password") {
            form.current.reset();
        }
        request(url + "/" + id, set, "post", formdata, e)
            .then(data => {
                if (data?.errors === undefined) {
                    if (fid === "password") {
                        alert("Password successfully changed.");
                    }
                }
            });
    }

    useEffect(() => {
        request(url + "/" + id, setValues);
    }, []);

    return (<>
        <AdminNav />
        <div className="container-fluid page-body-wrapper">
            <AdminHeader da={data} />
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="page-header">
                        <h3 className="page-title"> Edit User </h3>
                        <Back link="/users" />
                    </div>
                    <div className="row">
                        <UpdateProfile refs={{ fname, lname, email, phone }} data={data} setValues={setValues} execute={execute} showPassword="" />
                        <ChangePassword data={data} setData={setData} execute={execute} showPassword="" />
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

export default EditUser
