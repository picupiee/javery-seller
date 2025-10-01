import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthForm from "./AuthForm";
import SellerDashboard from "./SellerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<SellerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
