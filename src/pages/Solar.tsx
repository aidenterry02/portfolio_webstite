import { useEffect } from "react";

const DEMO = "https://aidenterry02.github.io/SolarPowerSimulation/";

/**
 * Nested portfolio route that hands off to the live Hometown Solar demo.
 * Keeps a single brand path: /portfolio_webstite/solar
 */
const Solar = () => {
  useEffect(() => {
    window.location.replace(DEMO);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b1220",
        color: "#e8eef9",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div>
        <p style={{ opacity: 0.7, letterSpacing: "0.08em", fontSize: 12 }}>
          HOMETOWN SOLAR SAVINGS
        </p>
        <h1 style={{ margin: "0.5rem 0 1rem" }}>Opening live demo…</h1>
        <p style={{ opacity: 0.8 }}>
          If you are not redirected,{" "}
          <a href={DEMO} style={{ color: "#f5b942" }}>
            open the solar demo
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Solar;
