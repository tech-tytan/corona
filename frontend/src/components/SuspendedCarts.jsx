import { useState, useRef, useEffect } from "react"
import { request } from "../utilities/request"
import { query } from "../utilities/query"
import { selectUnselect, select } from "../utilities/checkbox"
import AdminAuth from "./partials/AdminAuth"
import AdminNav from "./partials/AdminNav"
import AdminHeader from "./partials/AdminHeader"
import Date from "./partials/Date"
import Cart from "./partials/Cart"
import Pagination from "./partials/Pagination"
import Footer from "./partials/Footer"

function SuspendedCarts() {
  const [data, setData] = useState({});
  const queries = useRef({});
  const filter = useRef(null);
  const from = useRef(null);
  const to = useRef(null);
  const status = useRef(null);
  const listingsRef = useRef(null);
  const su = useRef(null);
  const listings = useRef(null);
  const url = "/suspended_carts";

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
          <div className="row ">
            <div className="col-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Suspended Carts</h4>
                  <div className="row">
                    <div className="col-md-6"></div>
                    <div className="col-md-6 text-right">
                      <form ref={filter} onSubmit={e => e.preventDefault()}>
                        <Date from={from} to={to} />
                        <br />
                        <select ref={status} className="form-control form-control-sm d-inline-block col-4">
                          <option value="">Request Type</option>
                          <option value="normal">Normal</option>
                          <option value="remove">Remove</option>
                        </select>
                        <br />
                        <button className="btn btn-primary col-4" onClick={() => {
                          queries.current.page = 1;
                          queries.current.from = from.current.value;
                          queries.current.to = to.current.value;
                          queries.current.request_type = status.current.value;
                          request(url + query(queries), setData);
                        }}>Filter</button>
                      </form>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <form ref={listingsRef} onSubmit={e => e.preventDefault()}>
                      <div className="mt-3">
                        <button className="btn btn-danger mr-2" onClick={e => {
                          if (confirm("Are you sure you want to clear this cart?")) {
                            const formdata = new FormData(listingsRef.current);
                            formdata.set("clear", "Clear");
                            listingsRef.current.reset();
                            request(url + query(queries), setData, "post", formdata, e);
                          }
                        }}>Clear</button>
                      </div>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>
                              <input ref={su} type="checkbox" onClick={e => {
                                selectUnselect(e, listings);
                              }} />
                            </th>
                            <th> User </th>
                            <th> Cart </th>
                            <th> Date </th>
                            <th> Request Type </th>
                          </tr>
                        </thead>
                        <tbody ref={listings}>
                          {(data?.suspended_carts?.data != undefined && data.suspended_carts.data.length > 0) ? data.suspended_carts.data.map((item, index) => <tr key={item.index}>
                            <td>
                              <input type="checkbox" name="selected[]" value={item.index} onClick={() => {
                                select(su, listings);
                              }} />
                            </td>
                            <td>
                              <span className="pl-2">{`${item.first_name} ${item.last_name}`}</span>
                            </td>
                            <td><a href="#" data-toggle="modal" data-target="#suspendedCart" data-id={item.index} onClick={e => {
                              queries.current.cart = e.target.dataset.id;
                              request(url + query(queries), setData);
                            }}> {item.index} </a></td>
                            <td> {item.date_time} </td>
                            <td>
                              {(item.type === "normal") ? <div className="badge badge-outline-success">{item.type}</div> : <div className="badge badge-outline-danger">{item.type}</div>}
                            </td>
                          </tr>) : <tr>
                            <td colSpan="5" className="text-center">No suspended cart yet.</td>
                          </tr>}
                          <Pagination colspan={{ first: "2", second: "1", third: "2" }} data={data?.suspended_carts} total={data?.suspended_carts_count} url={url} queries={queries} setData={setData} />
                        </tbody>
                      </table>
                    </form>
                  </div>
                  <Cart data={data} />
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

export default SuspendedCarts
