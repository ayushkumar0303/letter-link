import { useState } from "react";
import { Outlet } from "react-router";
import Header from "./components/Header";
import Footer from "./components/FooterComp";

function App() {
  return (
    <div className="min-w-96">
      <Header />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
