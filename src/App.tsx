import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import Alerts from "./pages/Alerts";
import Login from "./pages/Login";
import Reports from "./pages/Reports";
import LoginRecovery from "./pages/LoginRecovery";
import CreateAlert from "./pages/CreateAlert";
import EditAlert from "./pages/EditAlert";
import OrderDetails from "./pages/OrderDetails";
import SearchOrder from "./pages/SearchOrder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Orders />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/alerts/create" element={<CreateAlert />} />
        <Route path="/alerts/:id/edit" element={<EditAlert />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/recovery" element={<LoginRecovery />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/search-order" element={<SearchOrder />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
