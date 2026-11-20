import { useState, useRef, useEffect } from "react"
import { request } from "../utilities/request"
import { query } from "../utilities/query"
import { selectUnselect, select } from "../utilities/checkbox"
import { money_format } from "../utilities/currency"
import AdminAuth from "./partials/AdminAuth"
import AdminNav from "./partials/AdminNav"
import AdminHeader from "./partials/AdminHeader"
import Category from "./partials/Category"
import Date from "./partials/Date"
import Pagination from "./partials/Pagination"
import Footer from "./partials/Footer"

function Revenues() {
  const [data, setData] = useState({});
  const last_position = localStorage?.last_position;
  const queries = useRef((last_position != undefined) ? JSON.parse(last_position) : {});
  const filter = useRef(null);
  const category = useRef(null);
  const from = useRef(null);
  const to = useRef(null);
  const status = useRef(null);
  const listingsRef = useRef(null);
  const su = useRef(null);
  const listings = useRef(null);
  const url = "/revenues";

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
                  <h4 className="card-title">Revenues</h4>
                  <div className="row">
                    <div className="col-md-6"></div>
                    <div className="col-md-6 text-right">
                      <form ref={filter} onSubmit={e => e.preventDefault()}>
                        <Category category={category} categories={data?.categories} />
                        <br />
                        <Date from={from} to={to} />
                        <br />
                        <select ref={status} className="form-control form-control-sm d-inline-block col-4">
                          <option value="">Status</option>
                          <option value="completed">Completed</option>
                          <option value="canceled">Canceled</option>
                        </select>
                        <br />
                        <button className="btn btn-primary col-4" onClick={() => {
                          queries.current.page = 1;
                          queries.current.category = category.current.value;
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
                      <div className="mt-3">
                        <button className="btn btn-danger mr-2" onClick={e => {
                          if (confirm("Are you sure you want to cancel this transaction?")) {
                            const formdata = new FormData(listingsRef.current);
                            formdata.set("cancel", "Cancel");
                            listingsRef.current.reset();
                            request(url + query(queries), setData, "post", formdata, e);
                          }
                        }}>Cancel</button>
                      </div>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>
                              <input ref={su} type="checkbox" onClick={e => {
                                selectUnselect(e, listings);
                              }} />
                            </th>
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
                        <tbody ref={listings}>
                          {(data?.revenues?.data != undefined && data.revenues.data.length > 0) ? data.revenues.data.map((item, index) => <tr key={item.index}>
                            <td>
                              <input type="checkbox" name="selected[]" value={item.index} onClick={() => {
                                select(su, listings);
                              }} />
                            </td>
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
                            <td colSpan="9" className="text-center">No revenue yet.</td>
                          </tr>}
                          <Pagination colspan={{ first: "3", second: "3", third: "3" }} data={data?.revenues} total="0" url={url} queries={queries} setData={setData} />
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

export default Revenues
