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
import Price from "./partials/Price"
import Date from "./partials/Date"
import Pagination from "./partials/Pagination"
import Footer from "./partials/Footer"

function Expenditures() {
  const [data, setData] = useState({});
  const d = useRef({});
  const c = useRef("");
  const navigate = useNavigate();
  const last_position = localStorage?.last_position;
  const queries = useRef((last_position != undefined) ? JSON.parse(last_position) : {});
  const filter = useRef(null);
  const min_amount = useRef(null);
  const max_amount = useRef(null);
  const from = useRef(null);
  const to = useRef(null);
  const status = useRef(null);
  const listingsRef = useRef(null);
  const su = useRef(null);
  const listings = useRef(null);
  const url = "/expenditures";
  const ct = data?.expenditures_count;

  if (data?.expenditures != undefined) {
    d.current = data;
  }

  if (ct != undefined) {
    c.current = ct;
  }

  function execute(name, value, e) {
    const formdata = new FormData(listingsRef.current);
    formdata.set(name, value);
    listingsRef.current.reset();
    request(url + query(queries), setData, "post", formdata, e);
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
                  <h4 className="card-title">Expenditures</h4>
                  <Add link="/add_expenditure" />
                  <div className="row">
                    <Search refs={{ sort: "", filter }} queries={queries} url={url} setData={setData} />
                    <div className="col-md-6 text-right">
                      <form ref={filter} onSubmit={e => e.preventDefault()}>
                        <Price min_price={min_amount} max_price={max_amount} />
                        <br />
                        <Date from={from} to={to} />
                        <br />
                        <select ref={status} className="form-control form-control-sm d-inline-block col-4">
                          <option value="">Deleted</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                        <br />
                        <button className="btn btn-primary col-4" onClick={() => {
                          queries.current.page = 1;
                          queries.current.min_amount = min_amount.current.value;
                          queries.current.max_amount = max_amount.current.value;
                          queries.current.from = from.current.value;
                          queries.current.to = to.current.value;
                          queries.current.is_deleted = status.current.value;
                          request(url + query(queries), setData);
                        }}>Filter</button>
                      </form>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <form ref={listingsRef} onSubmit={e => e.preventDefault()}>
                      <div className="mt-3">
                        <button className="btn btn-success mr-2" onClick={e => {
                          execute("restore", "Restore", e);
                        }}>Restore</button>
                        <button className="btn btn-danger" onClick={e => {
                          execute("delete", "Delete", e);
                        }}>Delete</button>
                      </div>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>
                              <input ref={su} type="checkbox" onClick={e => {
                                selectUnselect(e, listings);
                              }} />
                            </th>
                            <th> Name </th>
                            <th> Amount </th>
                            <th> Date Added </th>
                            <th> Deleted </th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody ref={listings}>
                          {(d.current?.expenditures != undefined && d.current.expenditures.data.length > 0) ? d.current.expenditures.data.map((item, index) => <tr key={item.index}>
                            <td>
                              <input type="checkbox" name="selected[]" value={item.index} onClick={() => {
                                select(su, listings);
                              }} />
                            </td>
                            <td>
                              <span className="pl-2">{item.expenditure}</span>
                            </td>
                            <td> NGN {money_format(item.amount_spent)} </td>
                            <td> {item.timestamp} </td>
                            <td>
                              {(item.deleted === "no") ? <div className="badge badge-outline-success">{item.deleted}</div> : <div className="badge badge-outline-danger">{item.deleted}</div>}
                            </td>
                            <td><a href="#" data-id={item.index} onClick={e => {
                              lastPosition(queries, navigate, `/edit_expenditure/${e.target.dataset.id}`, e);
                            }}>Edit</a></td>
                          </tr>) : <tr>
                            <td colSpan="6" className="text-center">No record yet.</td>
                          </tr>}
                          <Pagination colspan={{ first: "2", second: "2", third: "2" }} data={d.current?.expenditures} total={c.current} url={url} queries={queries} setData={setData} />
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

export default Expenditures
