import { useState, useRef, useEffect } from "react"
import { request } from "../utilities/request"
import { query } from "../utilities/query"
import { selectUnselect, select } from "../utilities/checkbox"
import { money_format } from "../utilities/currency"
import UserAuth from "./partials/UserAuth"
import UserNav from "./partials/UserNav"
import UserHeader from "./partials/UserHeader"
import Search from "./partials/Search"
import Category from "./partials/Category"
import Cart from "./partials/Cart"
import Pagination from "./partials/Pagination"
import Footer from "./partials/Footer"

function Sales() {
  const [data, setData] = useState({});
  const [value, setValue] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const d = useRef({});
  const values = useRef([]);
  const queries = useRef({});
  const filter = useRef(null);
  const category = useRef(null);
  const listingsRef1 = useRef(null);
  const su1 = useRef(null);
  const listings1 = useRef(null);
  const listingsRef2 = useRef(null);
  const su2 = useRef(null);
  const listings2 = useRef(null);
  const url = "/sales";

  if (data?.products != undefined) {
    d.current = data;
  }

  function execute(listingsRef, name, value, e) {
    const formdata = new FormData(listingsRef.current);
    formdata.set(name, value);
    if (name != "add" && d.current?.cart?.index != undefined) {
      formdata.set("cart", d.current.cart.index);
    }
    request(url + query(queries), setData, "post", formdata, e)
      .then(data => {
        listingsRef.current.reset();
        if (name != "add") {
          values.current = [];
          setSelectedValues({});
        }
        if (data?.error != undefined) {
          alert(data.error);
        }
      });
  }

  useEffect(() => {
    request(url, setData);
  }, []);

  return (<>
    <UserAuth status={data?.status} />
    <UserNav />
    <div className="container-fluid page-body-wrapper">
      <UserHeader da={data} />
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="row">
            <div className="col-md-8 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-row justify-content-between">
                    <h4 className="card-title mb-1">Products</h4>
                    <p className="text-muted mb-1">Available Products</p>
                  </div>
                  <div className="row">
                    <Search refs={{ sort: "", filter }} queries={queries} url={url} setData={setData} />
                    <div className="col-md-6 text-right">
                      <form ref={filter} onSubmit={e => e.preventDefault()}>
                        <Category category={category} categories={d.current?.categories} />
                        <br />
                        <button className="btn btn-primary col-4" onClick={() => {
                          queries.current.page = 1;
                          queries.current.category = category.current.value;
                          request(url + query(queries), setData);
                        }}>Filter</button>
                      </form>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <form ref={listingsRef1} onSubmit={e => e.preventDefault()}>
                      <div className="mt-3">
                        <button className="btn btn-primary" onClick={e => {
                          execute(listingsRef1, "add", "Add", e);
                        }}>Add to Cart</button>
                      </div>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>
                              <input ref={su1} type="checkbox" onClick={e => {
                                selectUnselect(e, listings1);
                              }} />
                            </th>
                            <th> Name </th>
                            <th> Price </th>
                            <th> Category </th>
                          </tr>
                        </thead>
                        <tbody ref={listings1}>
                          {(d.current?.products?.data != undefined && d.current.products.data.length > 0) ? d.current.products.data.map((item, index) => <tr key={item.index}>
                            <td>
                              <input type="checkbox" name="selected[]" value={item.index} onClick={() => {
                                select(su1, listings1);
                              }} />
                            </td>
                            <td>
                              <span className="pl-2">{item.product}</span>
                            </td>
                            <td> NGN {money_format(item.amount)} </td>
                            <td> {item.category} </td>
                          </tr>) : <tr>
                            <td colSpan="4" className="text-center">No product yet.</td>
                          </tr>}
                          <Pagination colspan={{ first: "1", second: "2", third: "1" }} data={d.current?.products} total={d.current?.products_count} url={url} queries={queries} setData={setData} />
                        </tbody>
                      </table>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Cart{(d.current?.cart != undefined && d.current.cart_items.length > 0) ? `(${d.current.cart_items.length})` : ""}</h4>
                  <form ref={listingsRef2} onSubmit={e => e.preventDefault()}>
                    <div className="row">
                      <div className="col-9">
                        <label className="form-check-label mr-2">
                          <input type="checkbox" ref={su2} onClick={e => {
                            selectUnselect(e, listings2);
                            setSelectedValues({});
                          }} /> </label>
                        <button className="add btn btn-sm btn-danger mr-2" onClick={e => {
                          execute(listingsRef2, "remove", "Remove", e);
                        }}>Remove</button>
                        <button className="add btn btn-sm btn-warning" onClick={e => {
                          execute(listingsRef2, "suspend", "Suspend", e);
                        }}>Suspend</button>
                      </div>
                      <div className="col-3 text-right">
                        <button className="add btn btn-sm btn-primary ml-auto" onClick={e => {
                          execute(listingsRef2, "sold", "Sold", e);
                        }}>Sold</button>
                      </div>
                      {(Object.keys(selectedValues).length > 0) ? <div className="col-12 mt-2"><span className="text-muted">Selected Total:</span> NGN {money_format(Object.values(selectedValues).reduce((acc, cur) => acc + cur, 0))}</div> : ""}
                    </div>
                    <div ref={listings2} className="list-wrapper cart-container">
                      <ul className="d-flex flex-column-reverse text-white todo-list todo-list-custom">
                        {(d.current?.cart != undefined && d.current.cart_items.length > 0) ? d.current.cart_items.map((item, index) => {
                          values.current[index] = (Number(item.amount) * Number(item.qty));
                          return <li key={item.index}>
                            <label className="form-check-label">
                              <input type="checkbox" name="chosen[]" value={item.index} data-amount={item.amount} data-qty={item.qty} onClick={e => {
                                select(su2, listings2);
                                (e.target.checked) ? setSelectedValues(prev => ({ ...prev, ...{ [item.index]: (Number(e.target.dataset.amount) * Number(e.target.dataset.qty)) } })) : setSelectedValues(prev => ({ ...prev, ...{ [item.index]: 0 } }));
                              }} /> <span className="text-muted">{item.product}</span> <span className="text-white">NGN {money_format(item.amount)}</span></label>
                            <input type="text" className="form-control form-control-sm w-25 ml-auto" placeholder="QTY" data-id={item.product_index} data-ciid={item.index} value={value[item.index] ?? item.qty} onChange={e => {
                              setValue(prev => ({ ...prev, ...{ [e.target.dataset.ciid]: e.target.value } }));
                              const formdata = new FormData();
                              formdata.set("cart", d.current.cart.index);
                              formdata.set("product", e.target.dataset.id);
                              formdata.set("cart_item", e.target.dataset.ciid);
                              formdata.set("quantity", e.target.value);
                              formdata.set("update", "Update");
                              request(url + query(queries), setData, "post", formdata)
                                .then(() => {
                                  listingsRef2.current.reset();
                                  setSelectedValues({});
                                });
                            }} />
                          </li>
                        }) : <li>Cart is empty.</li>}
                      </ul>
                    </div>
                    {(values.current.length > 0) ? <div className="mt-2"><span className="text-muted">Cart Total:</span> NGN {money_format(values.current.reduce((acc, cur) => acc + cur))}</div> : ""}
                  </form>
                </div>
                <div className="card-body">
                  <h4 className="card-title">Suspended Carts{(d.current?.suspended_carts != undefined && d.current.suspended_carts.length > 0) ? `(${d.current.suspended_carts.length})` : ""}</h4>
                  <div className="list-wrapper cart-container">
                    <ul className="d-flex flex-column-reverse text-white todo-list todo-list-custom">
                      {(d.current?.suspended_carts != undefined && d.current.suspended_carts.length > 0) ? d.current.suspended_carts.map((item, index) => <li key={item.index}>
                        <a href="#" className="wb" data-toggle="modal" data-target="#suspendedCart" data-id={item.index} onClick={e => {
                          queries.current.get_cart = e.target.dataset.id;
                          request(url + query(queries), setData);
                        }}>{item.index}</a>
                        <button className="btn btn-sm btn-primary ml-auto" data-id={item.index} onClick={e => {
                          const formdata = new FormData();
                          formdata.set("suspended_cart", e.target.dataset.id);
                          formdata.set("restore", "Restore");
                          request(url + query(queries), setData, "post", formdata, e);
                        }}>Restore</button>
                      </li>) : <li>No suspended cart.</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Cart data={d.current} />
        </div>
        {/* content-wrapper ends */}
        <Footer />
      </div>
      {/* main-panel ends */}
    </div>
    {/* page-body-wrapper ends */}
  </>)
}

export default Sales
