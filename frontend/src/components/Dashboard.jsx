import { useState, useEffect } from "react"
import { Link } from "react-router"
import { request } from "../utilities/request"
import { money_format } from "../utilities/currency"
import AdminAuth from "./partials/AdminAuth"
import AdminNav from "./partials/AdminNav"
import AdminHeader from "./partials/AdminHeader"
import Footer from "./partials/Footer"

function Dashboard() {
    const [data, setData] = useState({});
    const url = "/dashboard";

    useEffect(() => {
        request(url, setData);
    }, []);

    return (<>
        <AdminAuth status={data?.status} />
        <AdminNav />
        <div className="container-fluid page-body-wrapper">
            <AdminHeader da={data} />
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="row">
                        <div className="col-sm-4 grid-margin">
                            <div className="card">
                                <div className="card-body">
                                    <h5>Categories</h5>
                                    <div className="row">
                                        <div className="col-8 col-sm-12 col-xl-8 my-auto">
                                            <div className="d-flex d-sm-block d-md-flex align-items-center">
                                                <h2 className="mb-0">{(data?.categories != undefined) ? data.categories : ""}</h2>
                                            </div>
                                        </div>
                                        <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                                            <i className="icon-lg mdi mdi-layers text-primary ml-auto"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4 grid-margin">
                            <div className="card">
                                <div className="card-body">
                                    <h5>Products</h5>
                                    <div className="row">
                                        <div className="col-8 col-sm-12 col-xl-8 my-auto">
                                            <div className="d-flex d-sm-block d-md-flex align-items-center">
                                                <h2 className="mb-0">{(data?.products != undefined) ? data.products : ""}</h2>
                                            </div>
                                        </div>
                                        <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                                            <i className="icon-lg mdi mdi-package text-danger ml-auto"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4 grid-margin">
                            <div className="card">
                                <div className="card-body">
                                    <h5>Users</h5>
                                    <div className="row">
                                        <div className="col-8 col-sm-12 col-xl-8 my-auto">
                                            <div className="d-flex d-sm-block d-md-flex align-items-center">
                                                <h2 className="mb-0">{(data?.users != undefined) ? data.users : ""}</h2>
                                            </div>
                                        </div>
                                        <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                                            <i className="icon-lg mdi mdi-account-group text-success ml-auto"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-12 grid-margin">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Revenues</h4>
                                    <div className="text-right mb-3">
                                        <Link to="/revenues" className="btn btn-primary">More Revenues</Link>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>User</th>
                                                    <th> Name </th>
                                                    <th> Quantity </th>
                                                    <th> Price </th>
                                                    <th> Cost </th>
                                                    <th> Category </th>
                                                    <th> Date Sold </th>
                                                    <th> Status </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(data?.revenues != undefined && data.revenues.length > 0) ? data.revenues.map((item, index) => <tr key={item.index}>
                                                    <td>
                                                        <span className="pl-2">{`${item.first_name} ${item.last_name}`}</span>
                                                    </td>
                                                    <td>
                                                        <span className="pl-2">{item.product}</span>
                                                    </td>
                                                    <td> {item.qty} </td>
                                                    <td> NGN {money_format(item.amount)} </td>
                                                    <td> NGN {money_format(item.amount_paid)} </td>
                                                    <td> {item.category} </td>
                                                    <td> {item.date_time} </td>
                                                    <td>
                                                        {(item.state === "completed") ? <div className="badge badge-outline-success">{item.state}</div> : <div className="badge badge-outline-danger">{item.state}</div>}
                                                    </td>
                                                </tr>) : <tr>
                                                    <td colSpan="8" className="text-center">No revenue yet.</td>
                                                </tr>}
                                            </tbody>
                                        </table>
                                    </div>
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

export default Dashboard
