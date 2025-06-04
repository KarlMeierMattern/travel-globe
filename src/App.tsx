import { Routes, Route } from "react-router-dom";
import Hello from "./frontend/components/Hello";
import GlobeComponent from "./frontend/components/Globe";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GlobeComponent />} />
      <Route path="/api-check" element={<Hello />} />
    </Routes>
  );
}
