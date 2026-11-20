import { useState, useRef, useEffect } from "react"
import { useParams } from "react-router"
import { request } from "../../utilities/request"
import AdminNav from "./AdminNav"
import AdminHeader from "./AdminHeader"
import Back from "./Back"
import Footer from "./Footer"

function EditProduct() {
    const [data, setData] = useState({});
    const { id } = useParams();
    const d = useRef({});
    const ct = useRef({});
    const edit = useRef(null);
    const name = useRef(null);
    const quantity = useRef(null);
    const price = useRef(null);
    const cost_price = useRef(null);
    const category = useRef(null);
    const url = "/products";
    const cts = data?.categories;

    if (cts != undefined) {
        ct.current = cts;
    }

    function setValues(data) {
        const product = data?.product;
        if (product != undefined) {
            d.current = data;
            name.current.value = product.product;
            quantity.current.value = product.qty;
            price.current.value = product.amount;
            cost_price.current.value = product.amount_paid;
            category.current.value = product.category_index;
        }
        setData(data);
    }

    useEffect(() => {
        request(url + "/" + id, setValues);
    }, [data]);

    return (<>
        <AdminNav />
        <div className="container-fluid page-body-wrapper">
            <AdminHeader da={data} />
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="page-header">
                        <h3 className="page-title"> Edit Product </h3>
                        <Back link="/products" />
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
                                        <div className="form-group">
                                            <label htmlFor="quantity">Quantity</label>
                                            <input ref={quantity} type="text" className="form-control" id="quantity" name="quantity" placeholder="Quantity" />
                                            <div className="text-danger">{(data?.errors?.quantity != undefined) ? data.errors.quantity[0] : ""}</div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="price">Price</label>
                                            <input ref={price} type="text" className="form-control" id="price" name="price" placeholder="Price" />
                                            <div className="text-danger">{(data?.errors?.price != undefined) ? data.errors.price[0] : ""}</div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cost_price">Cost Price</label>
                                            <input ref={cost_price} type="text" className="form-control" id="cost_price" name="cost_price" placeholder="Cost Price" />
                                            <div className="text-danger">{(data?.errors?.cost_price != undefined) ? data.errors.cost_price[0] : ""}</div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="category">Category</label>
                                            <select ref={category} name="category" id="category" className="form-control">
                                                {(ct.current != undefined && ct.current.length > 0) ? ct.current.map((item, index) => <option key={item.index} value={item.index}>
                                                    {item.category}
                                                </option>) : ""}
                                            </select>
                                            <div className="text-danger">{(data?.errors?.category != undefined) ? data.errors.category[0] : ""}</div>
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

export default EditProduct
