import { useState, useRef, useEffect } from "react"
import { request } from "../utilities/request"
import { query } from "../utilities/query"
import { money_format } from "../utilities/currency"
import AdminAuth from "./partials/AdminAuth"
import AdminNav from "./partials/AdminNav"
import AdminHeader from "./partials/AdminHeader"
import Date from "./partials/Date"
import Pagination from "./partials/Pagination"
import Footer from "./partials/Footer"

function Logs() {
  const [data, setData] = useState({});
  const queries = useRef({});
  const filter = useRef(null);
  const from = useRef(null);
  const to = useRef(null);
  const url = "/logs";

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
                  <h4 className="card-title">Logs</h4>
                  <div className="row">
                    <div className="col-md-6"></div>
                    <div className="col-md-6 text-right">
                      <form ref={filter} onSubmit={e => e.preventDefault()}>
                        <Date from={from} to={to} />
                        <br />
                        <button className="btn btn-primary col-4" onClick={() => {
                          queries.current.page = 1;
                          queries.current.from = from.current.value;
                          queries.current.to = to.current.value;
                          request(url + query(queries), setData);
                        }}>Filter</button>
                      </form>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th> User </th>
                          <th> Total </th>
                          <th> Description </th>
                          <th> Date </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(data?.logs?.data != undefined && data.logs.data.length > 0) ? data.logs.data.map((item, index) => <tr key={index}>
                          <td>
                            <span className="pl-2">{`${item.first_name} ${item.last_name}`}</span>
                          </td>
                          <td>NGN {money_format(item.sum)}</td>
                          <td>
                            <span className="pl-2">{item.desc}</span>
                          </td>
                          <td> {item.date_time} </td>
                        </tr>) : <tr>
                          <td colSpan="4" className="text-center">No logs yet.</td>
                        </tr>}
                        <Pagination colspan={{ first: "1", second: "2", third: "1" }} data={data?.logs} total="0" url={url} queries={queries} setData={setData} />
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

export default Logs
