import { useState, useRef, useEffect } from "react"
import { useParams } from "react-router"
import { request } from "../../utilities/request"
import AdminNav from "./AdminNav"
import AdminHeader from "./AdminHeader"
import Back from "./Back"
import Footer from "./Footer"

function EditCategory() {
    const [data, setData] = useState({});
    const { id } = useParams();
    const edit = useRef(null);
    const name = useRef(null);
    const url = "/categories";

    function setValues(data) {
        const category = data?.category;
        if (category != undefined) {
            name.current.value = category.category;
        }
        setData(data);
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
                        <h3 className="page-title"> Edit Category </h3>
                        <Back link="/categories" />
                    </div>
                    <div className="row">
                        <div className="col-md-6 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Edit</h4>
                                    <form ref={edit} className="forms-sample" onSubmit={e => e.preventDefault()}>
                                        <div className="form-group">
                                            <label htmlFor="name">Name</label>
                                            <input ref={name} type="text" className="form-control" id="name" name="name" placeholder="Name" />
                                            <div className="text-danger">{(data?.errors?.name != undefined) ? data.errors.name[0] : ""}</div>
                                        </div>
                                        <div className="form-group text-right">
                                            <button type="submit" className="btn btn-primary mr-2" name="edit" value="Edit" onClick={e => {
                                                const formdata = new FormData(edit.current, e.target);
                                                formdata.set("_method", "PUT");
                                                request(url + "/" + id, setData, "post", formdata, e);
                                            }}>Edit</button>
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

export default EditCategory
