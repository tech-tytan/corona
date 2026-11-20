import { useState, useEffect, useRef } from 'react'
import { request } from '../../utilities/request'
import { Link, Outlet, useNavigate } from 'react-router'

function AdminHeader({ da }) {
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const d = useRef({});
    const url = "/admin_header";

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
                <Link className="navbar-brand brand-logo-mini" to="/dashboard"><img src="/assets/images/logo-mini.svg" alt="logo" /></Link>
            </div>
            <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
                <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
                    <span className="mdi mdi-menu"></span>
                </button>
                <ul className="navbar-nav navbar-nav-right">
                    <li className="nav-item dropdown">
                        <Link className="nav-link count-indicator dropdown-toggle" id="notificationDropdown" to="/suspended_carts">
                            <i className="mdi mdi-cart"></i>
                            {(d.current.suspended_carts > 0) ? <span className="count bg-danger"></span> : ""}
                        </Link>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link" id="profileDropdown" href="#" data-toggle="dropdown">
                            <div className="navbar-profile">
                                <p className="mb-0 d-sm-block navbar-profile-name">{(d.current?.full_name != undefined) ? d.current.full_name : ""}</p>
                                <i className="mdi mdi-menu-down d-sm-block"></i>
                            </div>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="profileDropdown">
                            <Link className="dropdown-item preview-item" to="/profile">
                                <div className="preview-thumbnail">
                                    <div className="preview-icon bg-dark rounded-circle">
                                        <i className="mdi mdi-account text-success"></i>
                                    </div>
                                </div>
                                <div className="preview-item-content">
                                    <p className="preview-subject mb-1">Profile</p>
                                </div>
                            </Link>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item preview-item" onClick={e => {
                                e.preventDefault();
                                request("/admin_signout", setData)
                                    .then(data => {
                                        if (data?.status === "success") {
                                            navigate("/admin_signin");
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

export default AdminHeader
