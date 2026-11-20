import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router"
import { request } from "../utilities/request"
import { query } from "../utilities/query"
import { money_format } from "../utilities/currency"
import { lastPosition } from "../utilities/navigate"
import AdminAuth from "./partials/AdminAuth"
import AdminNav from "./partials/AdminNav"
import AdminHeader from "./partials/AdminHeader"
import Pagination from "./partials/Pagination"
import Footer from "./partials/Footer"

function FinancialSummary() {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const queries = useRef({});
  const q = useRef({});
  const filter = useRef(null);
  const from = useRef(null);
  const to = useRef(null);
  const url = "/financial_summary";

  function execute(destination, e) {
    q.current.page = 1;
    q.current.from = e.target.dataset.date + "-01";
    q.current.to = e.target.dataset.date + "-31";
    lastPosition(q, navigate, destination, e);
  }

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
                  <h4 className="card-title">Financial Summary</h4>
                  <div className="row">
                    <div className="col-md-6"></div>
                    <div className="col-md-6 text-right">
                      <form ref={filter} onSubmit={e => e.preventDefault()}>
                        <input ref={from} type="text" className="form-control form-control-sm d-inline-block col-4" placeholder="From: YYYY-MM" />
                        <br />
                        <input ref={to} type="text" className="form-control form-control-sm d-inline-block col-4" placeholder="To: YYYY-MM" />
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
                          <th> In </th>
                          <th> Out </th>
                          <th> Balance </th>
                          <th> Date </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(data?.revenues_expenditures?.data != undefined && data.revenues_expenditures.data.length > 0) ? data.revenues_expenditures.data.map((item, index) => {
                          const profit = (Number(item.total_price) - Number(item.total_cost_price));
                          const balance = (profit - Number(item.total_amount));
                          return <tr key={index}>
                            <td>
                              <span className="pl-2"><a href="#" className="text-success" data-date={item.date} onClick={e => {
                                execute("/revenues", e);
                              }}>NGN {money_format(profit)}</a></span>
                            </td>
                            <td>
                              <span className="pl-2"><a href="#" className="text-warning" data-date={item.date} onClick={e => {
                                execute("/expenditures", e);
                              }}>NGN {money_format(item.total_amount)}</a></span>
                            </td>
                            <td>
                              {(balance > 0) ? <span className="pl-2 text-success">NGN {money_format(balance)}</span> : (balance === 0) ? <span className="pl-2 text-warning">NGN {money_format(balance)}</span> : <span className="pl-2 text-danger">NGN {money_format(balance)}</span>}
                            </td>
                            <td> {item.date} </td>
                          </tr>
                        }) : <tr>
                          <td colSpan="4" className="text-center">No data yet.</td>
                        </tr>}
                        <Pagination colspan={{ first: "1", second: "2", third: "1" }} data={data?.revenues_expenditures} total="0" url={url} queries={queries} setData={setData} />
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

export default FinancialSummary
