import { Routes, Route } from "react-router-dom";
import GlobeComponent from "./frontend/components/Globe";
import Hello from "./frontend/components/Hello";
import TestForm from "./frontend/components/TestForm";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GlobeComponent />} />
      <Route path="/api-check" element={<Hello />} />
      <Route path="/form" element={<TestForm />} />
    </Routes>
  );
}
