import { useState, useEffect, useRef } from 'react'
import { request } from '../../utilities/request'
import { Link, Outlet, useNavigate } from 'react-router'

function UserHeader({ da }) {
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const d = useRef({});
    const url = "/user_header";

    if (data?.full_name != undefined) {
        d.current = data;
    }

    useEffect(() => {
        request(url, setData);
    }, [da]);

    return (<>
        {/* partial:partials/_navbar.html */}
        <nav className="navbar p-0 fixed-top d-flex flex-row">
            <div className="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
                <Link className="navbar-brand brand-logo-mini" to="/sales"><img src="/assets/images/logo-mini.svg" alt="logo" /></Link>
            </div>
            <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
                <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
                    <span className="mdi mdi-menu"></span>
                </button>
                <ul className="navbar-nav navbar-nav-right">
                    <li className="nav-item dropdown">
                        <a className="nav-link" id="profileDropdown" href="#" data-toggle="dropdown">
                            <div className="navbar-profile">
                                <p className="mb-0 d-sm-block navbar-profile-name">{(d.current?.full_name != undefined) ? d.current.full_name : ""}</p>
                                <i className="mdi mdi-menu-down d-sm-block"></i>
                            </div>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="profileDropdown">
                            <a className="dropdown-item preview-item" onClick={e => {
                                e.preventDefault();
                                request("/user_signout", setData)
                                    .then(data => {
                                        if (data?.status === "success") {
                                            navigate("/signin");
                                        }
                                    });
                            }}>
                                <div className="preview-thumbnail">
                                    <div className="preview-icon bg-dark rounded-circle">
                                        <i className="mdi mdi-logout text-danger"></i>
                                    </div>
                                </div>
                                <div className="preview-item-content">
                                    <p className="preview-subject mb-1">Sign out</p>
                                </div>
                            </a>
                        </div>
                    </li>
                </ul>
                <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
                    <span className="mdi mdi-format-line-spacing"></span>
                </button>
            </div>
        </nav>
        {/* partial */}
        <Outlet />
    </>)
}

export default UserHeader
