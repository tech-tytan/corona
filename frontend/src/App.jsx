import { createBrowserRouter, RouterProvider } from 'react-router'
import Initialize from './components/Initialize'
import Home from './components/Home'
import AdminSignin from './components/AdminSignin'
import ForgotPassword from './components/ForgotPassword'
import Dashboard from './components/Dashboard'
import Revenues from './components/Revenues'
import Categories from './components/Categories'
import AddCategory from './components/partials/AddCategory'
import EditCategory from './components/partials/EditCategory'
import Products from './components/Products'
import AddProduct from './components/partials/AddProduct'
import EditProduct from './components/partials/EditProduct'
import Expenditures from './components/Expenditures'
import AddExpenditure from './components/partials/AddExpenditure'
import EditExpenditure from './components/partials/EditExpenditure'
import Users from './components/Users'
import AddUser from './components/partials/AddUser'
import EditUser from './components/partials/EditUser'
import FinancialSummary from './components/FinancialSummary'
import Logs from './components/Logs'
import SuspendedCarts from './components/SuspendedCarts'
import Profile from './components/Profile'
import UserSignin from './components/UserSignin'
import Sales from './components/Sales'

const router = createBrowserRouter([
  {
    element: <Initialize />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/admin_signin",
        element: <AdminSignin />
      },
      {
        path: "/forgot_password",
        element: <ForgotPassword />
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/revenues",
        element: <Revenues />
      },
      {
        path: "/categories",
        element: <Categories />
      },
      {
        path: "/add_category",
        element: <AddCategory />
      },
      {
        path: "/edit_category/:id",
        element: <EditCategory />
      },
      {
        path: "/products",
        element: <Products />
      },
      {
        path: "/add_product",
        element: <AddProduct />
      },
      {
        path: "/edit_product/:id",
        element: <EditProduct />
      },
      {
        path: "/expenditures",
        element: <Expenditures />
      },
      {
        path: "/add_expenditure",
        element: <AddExpenditure />
      },
      {
        path: "/edit_expenditure/:id",
        element: <EditExpenditure />
      },
      {
        path: "/users",
        element: <Users />
      },
      {
        path: "/add_user",
        element: <AddUser />
      },
      {
        path: "/edit_user/:id",
        element: <EditUser />
      },
      {
        path: "/financial_summary",
        element: <FinancialSummary />
      },
      {
        path: "/logs",
        element: <Logs />
      },
      {
        path: "/suspended_carts",
        element: <SuspendedCarts />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/signin",
        element: <UserSignin />
      },
      {
        path: "/sales",
        element: <Sales />
      }
    ]
  }
]);

function App() {

  return (<>
    <div className="container-scroller">
      <RouterProvider router={router} />
    </div>
    {/* container-scroller */}
  </>)
}

export default App
