import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AboutPage from "@/pages/about-page";
import DashboardPage from "@/pages/dashboard-page";

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
