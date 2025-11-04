import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRouter from "./router";
import { Toaster } from "react-hot-toast"; // 👈 Add this
import FixedWhatsApp from "./components/WhatsAppButton"; // 👈 Import the FixedWhatsApp component
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRouter /> {/* Main content routed here */}
      <Footer />
       <FixedWhatsApp /> {/* Fixed WhatsApp button globally */}
      {/* 🔔 Toast container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
