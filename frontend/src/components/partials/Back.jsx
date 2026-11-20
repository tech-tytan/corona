import { Link } from "react-router"

function Back({ link }) {
    return (<nav aria-label="breadcrumb">
        <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to={link} className="btn btn-primary">Go Back</Link></li>
        </ol>
    </nav>)
}

export default Back
