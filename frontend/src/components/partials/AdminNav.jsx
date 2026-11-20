import { Link, Outlet } from 'react-router'

function AdminNav() {
  return (<>
    {/* partial:partials/_sidebar.html */}
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
        <Link className="sidebar-brand brand-logo" to="/dashboard"><img src="/assets/images/logo.svg" alt="logo" /></Link>
        <Link className="sidebar-brand brand-logo-mini" to="/dashboard"><img src="/assets/images/logo-mini.svg" alt="logo" /></Link>
      </div>
      <ul className="nav">
        <li className="nav-item nav-category">
          <span className="nav-link">Navigation</span>
        </li>
        <li className="nav-item menu-items">
          <Link className="nav-link" to="/dashboard">
            <span className="menu-icon">
              <i className="mdi mdi-speedometer"></i>
            </span>
            <span className="menu-title">Dashboard</span>
          </Link>
        </li>
        <li className="nav-item menu-items">
          <Link className="nav-link" to="/revenues">
            <span className="menu-icon">
              <i className="mdi mdi-plus-box"></i>
            </span>
            <span className="menu-title">Revenues</span>
          </Link>
        </li>
        <li className="nav-item menu-items">
          <Link className="nav-link" to="/categories">
            <span className="menu-icon">
              <i className="mdi mdi-layers"></i>
            </span>
            <span className="menu-title">Categories</span>
          </Link>
        </li>
        <li className="nav-item menu-items">
          <Link className="nav-link" to="/products">
            <span className="menu-icon">
              <i className="mdi mdi-package"></i>
            </span>
            <span className="menu-title">Products</span>
          </Link>
        </li>
        <li className="nav-item menu-items">
          <Link className="nav-link" to="/expenditures">
            <span className="menu-icon">
              <i className="mdi mdi-minus-box"></i>
            </span>
            <span className="menu-title">Expenditures</span>
          </Link>
        </li>
        <li className="nav-item menu-items">
          <Link className="nav-link" to="/users">
            <span className="menu-icon">
              <i className="mdi mdi-account-group"></i>
            </span>
            <span className="menu-title">Users</span>
          </Link>
        </li>
        <li className="nav-item menu-items">
          <Link className="nav-link" to="/financial_summary">
            <span className="menu-icon">
              <i className="mdi mdi-finance"></i>
            </span>
            <span className="menu-title">Financial Summary</span>
          </Link>
        </li>
        <li className="nav-item menu-items">
          <Link className="nav-link" to="/logs">
            <span className="menu-icon">
              <i className="mdi mdi-history"></i>
            </span>
            <span className="menu-title">Logs</span>
          </Link>
        </li>
      </ul>
    </nav>
    {/* partial */}
    <Outlet />
  </>)
}

export default AdminNav
