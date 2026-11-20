import { request } from "../../utilities/request"
import { query } from "../../utilities/query"

function Pagination({ colspan: { first, second, third }, data, total, url, queries, setData }) {
    const d = (data != undefined) ? true : false;
    const current_page = (d) ? data.current_page : "";
    const last_page = (d) ? data.last_page : "";
    const count = (total != undefined && total > 0) ? total : "";

    function execute(type, page = "") {
        if (current_page != "" && last_page != "") {
            if (type === "previous") {
                queries.current.page = (current_page > 1) ? current_page - 1 : 1;
            }
            else {
                queries.current.page = (last_page > current_page) ? current_page + 1 : current_page;
            }
            request(url + query(queries), setData);
        }
    }

    return (<tr>
        <td colSpan={first}><button className="btn btn-primary" onClick={() => {
            execute("previous");
        }}>Previous</button></td>
        <td colSpan={second} className="text-center">Page {current_page} of {last_page}{(count != "") ? `, ${count} items` : ""}</td>
        <td colSpan={third} className="text-right"><button className="btn btn-primary" onClick={() => {
            execute("next");
        }}>Next</button></td>
    </tr>)
}

export default Pagination
