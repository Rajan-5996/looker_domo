import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GridBackground } from "./components/BackgroundGrid";
import Header from "./components/Header";
import { DashBoard, LookerAuth, Migrate, NotFound } from "./pages";

function App() {
  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        background: "var(--bg)",
      }}
    >
      <GridBackground />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LookerAuth />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/migrate" element={<Migrate />} />

            <Route
              path="*"
              element={
                <NotFound />
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
