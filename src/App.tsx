import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import Alerts from "./pages/Alerts";
import Login from "./pages/Login";
import Reports from "./pages/Reports";
import LoginRecovery from "./pages/LoginRecovery";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Orders />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/recovery" element={<LoginRecovery />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
