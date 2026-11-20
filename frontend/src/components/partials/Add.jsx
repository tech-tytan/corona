import { Link } from "react-router"

function Add({ link }) {
    return (<div className="text-right mb-3">
        <Link to={link} className="btn btn-primary">Add</Link>
    </div>)
}

export default Add
