import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router"
import { request } from "../../utilities/request"
import AdminNav from "./AdminNav"
import AdminHeader from "./AdminHeader"
import Back from "./Back"
import Footer from "./Footer"

function AddProduct() {
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const d = useRef({});
    const add = useRef(null);
    const url = "/products";

    if (data?.categories != undefined) {
        d.current = data;
    }

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
                        <h3 className="page-title"> Add Product </h3>
                        <Back link="/products" />
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
                                        <div className="form-group">
                                            <label htmlFor="quantity">Quantity</label>
                                            <input type="text" className="form-control" id="quantity" name="quantity" placeholder="Quantity" />
                                            <div className="text-danger">{(data?.errors?.quantity != undefined) ? data.errors.quantity[0] : ""}</div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="price">Price</label>
                                            <input type="text" className="form-control" id="price" name="price" placeholder="Price" />
                                            <div className="text-danger">{(data?.errors?.price != undefined) ? data.errors.price[0] : ""}</div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cost_price">Cost Price</label>
                                            <input type="text" className="form-control" id="cost_price" name="cost_price" placeholder="Cost Price" />
                                            <div className="text-danger">{(data?.errors?.cost_price != undefined) ? data.errors.cost_price[0] : ""}</div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="category">Category</label>
                                            <select name="category" id="category" className="form-control">
                                                <option value="">Category</option>
                                                {(d.current?.categories != undefined && d.current.categories.length > 0) ? d.current?.categories.map((item, index) => <option key={item.index} value={item.index}>
                                                    {item.category}
                                                </option>) : ""}
                                            </select>
                                            <div className="text-danger">{(data?.errors?.category != undefined) ? data.errors.category[0] : ""}</div>
                                        </div>
                                        <div className="form-group text-right">
                                            <button type="submit" className="btn btn-primary mr-2" name="add" value="Add" onClick={e => {
                                                const formdata = new FormData(add.current, e.target);
                                                request(url, setData, "post", formdata, e)
                                                    .then(data => {
                                                        if (data?.errors === undefined) {
                                                            add.current.reset();
                                                            navigate("/products");
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

export default AddProduct
