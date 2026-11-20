import { useRef } from "react"
import { request } from "../../utilities/request"
import { query } from "../../utilities/query"

function Search({ refs: { sort, filter }, queries, url, setData }) {
    const search = useRef(null);

    return (<div className="col-md-6 pb-3">
        <form onSubmit={e => e.preventDefault()}>
            <input ref={search} type="text" className="form-control form-control-sm d-inline-block col-8" placeholder="Search" />
            <button className="btn btn-primary" onClick={() => {
                (sort != "") ? sort.current.reset() : "";
                filter.current.reset();
                queries.current = {};
                queries.current.search = encodeURIComponent(search.current.value);
                request(url + query(queries), setData);
            }}>Search</button>
        </form>
    </div>)
}

export default Search
