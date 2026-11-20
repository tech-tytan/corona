import { Link, Outlet } from 'react-router'

function UserNav() {
  return (<>
    {/* partial:partials/_sidebar.html */}
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
        <Link className="sidebar-brand brand-logo" to="/sales"><img src="/assets/images/logo.svg" alt="logo" /></Link>
        <Link className="sidebar-brand brand-logo-mini" to="/sales"><img src="/assets/images/logo-mini.svg" alt="logo" /></Link>
      </div>
      <ul className="nav">
        <li className="nav-item nav-category">
          <span className="nav-link">Navigation</span>
        </li>
        <li className="nav-item menu-items">
          <Link className="nav-link" to="/sales">
            <span className="menu-icon">
              <i className="mdi mdi-cash"></i>
            </span>
            <span className="menu-title">Sales</span>
          </Link>
        </li>
      </ul>
    </nav>
    {/* partial */}
    <Outlet />
  </>)
}

export default UserNav
