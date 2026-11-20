import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router"
import { request } from "../utilities/request"
import { query } from "../utilities/query"
import { lastPosition } from "../utilities/navigate"
import { selectUnselect, select } from "../utilities/checkbox"
import { money_format } from "../utilities/currency"
import AdminAuth from "./partials/AdminAuth"
import AdminNav from "./partials/AdminNav"
import AdminHeader from "./partials/AdminHeader"
import Add from "./partials/Add"
import Search from "./partials/Search"
import Category from "./partials/Category"
import Price from "./partials/Price"
import Date from "./partials/Date"
import Status from "./partials/Status"
import EnableDisable from "./partials/EnableDisable"
import Pagination from "./partials/Pagination"
import Footer from "./partials/Footer"

function Products() {
  const [data, setData] = useState({});
  const d = useRef({});
  const cc = useRef({});
  const navigate = useNavigate();
  const last_position = localStorage?.last_position;
  const queries = useRef((last_position != undefined) ? JSON.parse(last_position) : {});
  const filter = useRef(null);
  const category = useRef(null);
  const min_price = useRef(null);
  const max_price = useRef(null);
  const from = useRef(null);
  const to = useRef(null);
  const status = useRef(null);
  const listingsRef = useRef(null);
  const su = useRef(null);
  const listings = useRef(null);
  const url = "/products";

  if (data?.products != undefined) {
    d.current = data;
  }

  if (data?.categories != undefined) {
    cc.current = data;
  }

  useEffect(() => {
    request(url + ((last_position != undefined) ? query(queries) : ""), setData)
      .then(() => {
        (last_position != undefined) ? localStorage.removeItem("last_position") : "";
      });
  }, []);

  return (<>
    <AdminAuth status={data?.status} />
    <AdminNav />
    <div className="container-fluid page-body-wrapper">
      <AdminHeader da={data} />
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="row ">
            <div className="col-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Products</h4>
                  <Add link="/add_product" />
                  <div className="row">
                    <Search refs={{ sort: "", filter }} queries={queries} url={url} setData={setData} />
                    <div className="col-md-6 text-right">
                      <form ref={filter} onSubmit={e => e.preventDefault()}>
                        <Category category={category} categories={cc.current?.categories} />
                        <br />
                        <Price min_price={min_price} max_price={max_price} />
                        <br />
                        <Date from={from} to={to} />
                        <br />
                        <Status status={status} />
                        <br />
                        <button className="btn btn-primary col-4" onClick={() => {
                          queries.current.page = 1;
                          queries.current.category = category.current.value;
                          queries.current.min_price = min_price.current.value;
                          queries.current.max_price = max_price.current.value;
                          queries.current.from = from.current.value;
                          queries.current.to = to.current.value;
                          queries.current.status = status.current.value;
                          request(url + query(queries), setData);
                        }}>Filter</button>
                      </form>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <form ref={listingsRef} onSubmit={e => e.preventDefault()}>
                      <EnableDisable url={url} queries={queries} setData={setData} listingsRef={listingsRef} />
                      <table className="table">
                        <thead>
                          <tr>
                            <th>
                              <input ref={su} type="checkbox" onClick={e => {
                                selectUnselect(e, listings);
                              }} />
                            </th>
                            <th> Name </th>
                            <th> Quantity </th>
                            <th> Price </th>
                            <th> Cost </th>
                            <th> Category </th>
                            <th> Date Added </th>
                            <th> Status </th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody ref={listings}>
                          {(d.current?.products != undefined && d.current.products.data.length > 0) ? d.current.products.data.map((item, index) => <tr key={item.index}>
                            <td>
                              <input type="checkbox" name="selected[]" value={item.index} onClick={() => {
                                select(su, listings);
                              }} />
                            </td>
                            <td>
                              <span className="pl-2">{item.product}</span>
                            </td>
                            <td> {item.qty} </td>
                            <td> NGN {money_format(item.amount)} </td>
                            <td> NGN {money_format(item.amount_paid)} </td>
                            <td> {item.category} </td>
                            <td> {item.timestamp} </td>
                            <td>
                              {(item.state === "enabled") ? <div className="badge badge-outline-success">{item.state}</div> : <div className="badge badge-outline-danger">{item.state}</div>}
                            </td>
                            <td><a href="#" data-id={item.index} onClick={e => {
                              lastPosition(queries, navigate, `/edit_product/${e.target.dataset.id}`, e);
                            }}>Edit</a></td>
                          </tr>) : <tr>
                            <td colSpan="9" className="text-center">No record yet.</td>
                          </tr>}
                          <Pagination colspan={{ first: "3", second: "3", third: "3" }} data={d.current?.products} total={cc.current?.products_count} url={url} queries={queries} setData={setData} />
                        </tbody>
                      </table>
                    </form>
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

export default Products
