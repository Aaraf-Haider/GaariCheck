import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import SampleReport from "./pages/SampleReport";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewInspection from "./pages/NewInspection";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminInspection from "./pages/AdminInspection";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Checkout from "./pages/Checkout";
import Footer from "./components/Footer";
import PaymentStatus from "./pages/PaymentStatus";
import AdminPayments from "./pages/AdminPayments";
import MyPayments from "./pages/MyPayments";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/services" element={<Services />} />

        <Route path="/pricing" element={<Pricing />} />

        <Route path="/sample-report" element={<SampleReport />} />

        <Route path="/reviews" element={<Reviews />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/new-inspection" element={<NewInspection />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/admin/inspections/:id" element={<AdminInspection />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />   

        <Route path="/reset-password" element={<ResetPassword />} />    

        <Route path="/checkout" element={<Checkout />} /> 

        <Route path="/payment-status/:id" element={<PaymentStatus />} />

        <Route path="/admin/payments" element={<AdminPayments />} />

        <Route path="/my-payments" element={<MyPayments />} />

      </Routes>

      <Footer/>

    </BrowserRouter>
  );
}

export default App;