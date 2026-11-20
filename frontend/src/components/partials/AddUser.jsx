import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router"
import { request } from "../../utilities/request"
import AdminNav from "./AdminNav"
import AdminHeader from "./AdminHeader"
import Back from "./Back"
import Footer from "./Footer"

function AddUser() {
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const add = useRef(null);
    const password = useRef(null);
    const url = "/users";

    useEffect(() => {
        request(url, setData);
    }, []);

    return (<>
        <AdminNav />
        <div className="container-fluid page-body-wrapper">
            <AdminHeader da={data} />
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="page-header">
                        <h3 className="page-title"> Add User </h3>
                        <Back link="/users" />
                    </div>
                    <div className="row">
                        <div className="col-md-6 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Add</h4>
                                    <form ref={add} className="forms-sample" onSubmit={e => e.preventDefault()}>
                                        <div className="form-group">
                                            <label htmlFor="first_name">First Name</label>
                                            <input type="text" className="form-control" id="first_name" name="first_name" placeholder="First Name" />
                                            <div className="text-danger">{(data?.errors?.first_name != undefined) ? data.errors.first_name[0] : ""}</div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="last_name">Last Name</label>
                                            <input type="text" className="form-control" id="last_name" name="last_name" placeholder="Last Name" />
                                            <div className="text-danger">{(data?.errors?.last_name != undefined) ? data.errors.last_name[0] : ""}</div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email Address</label>
                                            <input type="email" className="form-control" id="email" name="email" placeholder="Email Address" />
                                            <div className="text-danger">{(data?.errors?.email != undefined) ? data.errors.email[0] : ""}</div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone">Phone Number</label>
                                            <input type="text" className="form-control" id="phone" name="phone" placeholder="Phone Number" />
                                            <div className="text-danger">{(data?.errors?.phone != undefined) ? data.errors.phone[0] : ""}</div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <input ref={password} type="password" className="form-control" id="password" name="password" placeholder="Password" />
                                            <div className="text-danger">{(data?.errors?.password != undefined) ? data.errors.password[0] : ""}</div>
                                        </div>
                                        <div className="form-group text-right">
                                            <button type="submit" className="btn btn-primary mr-2" name="add" value="Add" onClick={e => {
                                                const formdata = new FormData(add.current, e.target);
                                                password.current.value = "";
                                                request(url, setData, "post", formdata, e)
                                                    .then(data => {
                                                        if (data?.errors === undefined) {
                                                            add.current.reset();
                                                            navigate("/users");
                                                        }
                                                    });
                                            }}>Add</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
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

export default AddUser
