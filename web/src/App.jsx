import { Routes, Route } from "react-router-dom";
import Aides from "./Pages/Aides";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Aides />} />
      <Route path="/aides" element={<Aides />} />
    </Routes>
  );
}

export default App;
