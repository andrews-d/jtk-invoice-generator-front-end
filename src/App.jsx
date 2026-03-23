import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
// import Vendors from "./pages/Vendors";
// import GenerateInvoice from "./pages/GenerateInvoice";

import MainLayout from "./layouts/MainLayout";
import Vendors from "./pages/Vendors";
import Invoices from "./pages/Invoices";

function App() {
  const privateRoutes = [
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/vendor-management", element: <Vendors /> },
    { path: "/invoices", element: <Invoices /> },
  ];
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />

      {/* Layout Routes */}
      <Route element={<MainLayout />}>
        {privateRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
    </Routes>
  );
}

export default App;
