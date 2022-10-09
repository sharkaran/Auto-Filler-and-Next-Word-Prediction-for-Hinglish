import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Input from "./components/Input";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <Input />
      <Footer />
    </div>
  );
}

export default App;
