import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router"
import { request } from "../../utilities/request"
import AdminNav from "./AdminNav"
import AdminHeader from "./AdminHeader"
import Back from "./Back"
import Footer from "./Footer"

function AddCategory() {
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const add = useRef(null);
    const url = "/categories";

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
                        <h3 className="page-title"> Add Category </h3>
                        <Back link="/categories" />
                    </div>
                    <div className="row">
                        <div className="col-md-6 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Add</h4>
                                    <form ref={add} className="forms-sample" onSubmit={e => e.preventDefault()}>
                                        <div className="form-group">
                                            <label htmlFor="name">Name</label>
                                            <input type="text" className="form-control" id="name" name="name" placeholder="Name" />
                                            <div className="text-danger">{(data?.errors?.name != undefined) ? data.errors.name[0] : ""}</div>
                                        </div>
                                        <div className="form-group text-right">
                                            <button type="submit" className="btn btn-primary mr-2" name="add" value="Add" onClick={e => {
                                                const formdata = new FormData(add.current, e.target);
                                                request(url, setData, "post", formdata, e)
                                                    .then(data => {
                                                        if (data?.errors === undefined) {
                                                            add.current.reset();
                                                            navigate("/categories");
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

export default AddCategory
