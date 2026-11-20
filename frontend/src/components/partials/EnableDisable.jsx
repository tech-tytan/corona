import { request } from "../../utilities/request"
import { query } from "../../utilities/query"

function EnableDisable({ url, queries, setData, listingsRef }) {
    function execute(name, value, e) {
        const formdata = new FormData(listingsRef.current);
        formdata.set(name, value);
        listingsRef.current.reset();
        request(url + query(queries), setData, "post", formdata, e);
    }

    return (<div className="mt-3">
        <button className="btn btn-success mr-2" onClick={e => {
            execute("enable", "Enable", e);
        }}>Enable</button>
        <button className="btn btn-danger" onClick={e => {
            execute("disable", "Disable", e);
        }}>Disable</button>
    </div>)
}

export default EnableDisable
