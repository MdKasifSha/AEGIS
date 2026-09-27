import { useState, useMemo } from "react";
import useEmitterSimulation from "./hooks/useEmitterSimulation";
import { getRadCharProfile } from "./data/radcharProfiles";
import {
  authenticateUser,
  clearSession,
  getSessionUser,
  registerUser,
  saveSession,
} from "./data/userDatabase";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ReportPage from "./pages/ReportPage";

function App() {
  const [view, setView] = useState(() =>
    getSessionUser() ? "landing" : "login",
  );
  const [currentUser, setCurrentUser] = useState(() => getSessionUser());
  const [authError, setAuthError] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [simulationStatus, setSimulationStatus] = useState("IDLE");
  const [strategy, setStrategy] = useState("compare"); // 'sequential' | 'ai-smart' | 'compare'

  const [emitters, setEmitters] = useState({
    frequencyAgile: true,
    spatiallyRotating: true,
    periodicScan: false,
  });

  const [frequencyBands, setFrequencyBands] = useState(20);
  const [noiseLevel, setNoiseLevel] = useState(35);
  const [simSpeed, setSimSpeed] = useState(1);
  const [radcharProfileId, setRadcharProfileId] = useState("frequency-agile");

  const radcharProfile = useMemo(
    () => getRadCharProfile(radcharProfileId),
    [radcharProfileId],
  );

  const {
    grid,
    currentTick,
    receiverBandSeq,
    receiverBandSmart,
    hitMarkersSeq,
    hitMarkersSmart,
    metricsSeq,
    metricsSmart,
    chartData,
    eventLogs,
  } = useEmitterSimulation({
    simulationStatus,
    emitters,
    frequencyBands,
    noiseLevel,
    simSpeed,
    strategy,
  });

  const handleLogin = (username, password) => {
    const user = authenticateUser(username, password);

    if (!user) {
      setAuthError("Invalid username or password.");
      return;
    }

    saveSession(user);
    setCurrentUser(user);
    setAuthError("");
    setAuthMode("login");
    setView("landing");
  };

  const handleRegister = (username, password) => {
    const result = registerUser(username, password);

    if (!result.ok) {
      setAuthError(result.error);
      return;
    }

    saveSession(result.user);
    setCurrentUser(result.user);
    setAuthError("");
    setAuthMode("login");
    setView("landing");
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setAuthError("");
    setView("login");
    setSimulationStatus("IDLE");
  };

  const handleStart = () => setSimulationStatus("ACTIVE");
  const handlePause = () => setSimulationStatus("PAUSED");
  const handleReset = () => setSimulationStatus("IDLE");

  const handleSelectScenario = (scenarioId) => {
    setSimulationStatus("IDLE");
    if (scenarioId === 1) {
      setEmitters({
        frequencyAgile: true,
        spatiallyRotating: false,
        periodicScan: false,
      });
      setFrequencyBands(25);
      setSimSpeed(2);
      setRadcharProfileId("frequency-agile");
    } else if (scenarioId === 2) {
      setEmitters({
        frequencyAgile: false,
        spatiallyRotating: true,
        periodicScan: true,
      });
      setFrequencyBands(15);
      setSimSpeed(1);
      setRadcharProfileId("rotating-mainbeam");
    } else if (scenarioId === 3) {
      setEmitters({
        frequencyAgile: true,
        spatiallyRotating: true,
        periodicScan: true,
      });
      setFrequencyBands(30);
      setSimSpeed(5);
      setRadcharProfileId("multi-emitter");
    }
  };

  const handleDownloadReport = () => {
    if (chartData.length === 0) return;

    const pct = (value) => `${(value * 100).toFixed(1)}%`;
    const avgLatencySeq = Number(metricsSeq.avgLatency.toFixed(2));
    const avgLatencySmart = Number(metricsSmart.avgLatency.toFixed(2));
    const rows = chartData
      .map(
        (d) => `
          <tr>
            <td>${d.tick}</td>
            <td>${d.Sequential}</td>
            <td>${d.Smart}</td>
          </tr>
        `,
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>AEGIS Scan Benchmark Report</title>
          <style>
            :root {
              --bg: #020817;
              --panel: #0f172a;
              --panel-2: #111827;
              --line: rgba(148, 163, 184, 0.2);
              --text: #e2e8f0;
              --muted: #94a3b8;
              --orange: #f59e0b;
              --emerald: #34d399;
              --cyan: #22d3ee;
              --rose: #fb7185;
            }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              font-family: Inter, Arial, sans-serif;
              background: radial-gradient(circle at top, rgba(16,185,129,0.12), transparent 25%), var(--bg);
              color: var(--text);
              padding: 32px;
            }
            .report {
              max-width: 1100px;
              margin: 0 auto;
              border: 1px solid var(--line);
              border-radius: 18px;
              background: rgba(15, 23, 42, 0.92);
              box-shadow: 0 20px 80px rgba(15,118,110,0.12);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, rgba(52,211,153,0.08), rgba(34,211,238,0.04));
              border-bottom: 1px solid var(--line);
              padding: 28px 32px;
            }
            .eyebrow {
              letter-spacing: 0.24em;
              text-transform: uppercase;
              font-size: 10px;
              color: var(--muted);
              margin-bottom: 8px;
            }
            h1 {
              margin: 0;
              font-size: 32px;
              font-weight: 700;
            }
            .subtitle {
              margin-top: 8px;
              color: var(--muted);
              font-size: 14px;
            }
            .cards {
              display: grid;
              grid-template-columns: repeat(2, minmax(220px, 1fr));
              gap: 18px;
              padding: 24px 32px 0;
            }
            .card {
              border: 1px solid var(--line);
              border-radius: 14px;
              background: var(--panel-2);
              padding: 18px 20px;
            }
            .card-label {
              color: var(--muted);
              text-transform: uppercase;
              letter-spacing: 0.14em;
              font-size: 10px;
              margin-bottom: 12px;
            }
            .metric-value {
              font-size: 28px;
              font-weight: 700;
              font-family: "SFMono-Regular", Consolas, monospace;
            }
            .metric-detail {
              margin-top: 8px;
              color: var(--muted);
              font-size: 12px;
            }
            .panel {
              padding: 24px 32px 32px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 18px;
              border: 1px solid var(--line);
              border-radius: 12px;
              overflow: hidden;
            }
            th, td {
              padding: 12px 14px;
              text-align: left;
              border-bottom: 1px solid var(--line);
            }
            th {
              background: rgba(15, 23, 42, 0.9);
              color: var(--muted);
              text-transform: uppercase;
              letter-spacing: 0.12em;
              font-size: 10px;
            }
            td {
              font-size: 13px;
            }
            .success { color: var(--emerald); }
            .warning { color: var(--orange); }
            .info { color: var(--cyan); }
            .danger { color: var(--rose); }
            .chip {
              display: inline-block;
              padding: 6px 10px;
              border-radius: 999px;
              font-size: 11px;
              border: 1px solid var(--line);
              background: rgba(15, 23, 42, 0.7);
            }
            @media (max-width: 640px) {
              body { padding: 18px; }
              .cards { grid-template-columns: 1fr; }
              .header, .panel { padding-left: 18px; padding-right: 18px; }
            }
          </style>
        </head>
        <body>
          <div class="report">
            <div class="header">
              <div class="eyebrow">AEGIS Scan</div>
              <h1>Benchmark Report</h1>
              <div class="subtitle">
                Final tick: ${currentTick} • RadChar profile: ${radcharProfile.name} • Sequential sweep vs AI Smart scan
              </div>
            </div>

            <div class="cards">
              <div class="card">
                <div class="card-label">Sequential Sweep</div>
                <div class="metric-value info">${metricsSeq.totalHits}</div>
                <div class="metric-detail">Total hits • Pd ${pct(metricsSeq.pd)} • Latency ${avgLatencySeq} ticks</div>
              </div>

              <div class="card">
                <div class="card-label">AI Smart Scan</div>
                <div class="metric-value success">${metricsSmart.totalHits}</div>
                <div class="metric-detail">Total hits • Pd ${pct(metricsSmart.pd)} • Latency ${avgLatencySmart} ticks</div>
              </div>

              <div class="card">
                <div class="card-label">Detection Confidence</div>
                <div class="metric-value ${metricsSeq.pd >= metricsSmart.pd ? "warning" : "success"}">${pct(Math.max(metricsSeq.pd, metricsSmart.pd))}</div>
                <div class="metric-detail">Best case observed in ${metricsSeq.pd >= metricsSmart.pd ? "Sequential" : "AI Smart"}</div>
              </div>

              <div class="card">
                <div class="card-label">Summary</div>
                <div class="metric-value ${metricsSmart.totalHits >= metricsSeq.totalHits ? "success" : "warning"}">${
                  noiseLevel <= 0
                    ? metricsSeq.totalHits >= metricsSmart.totalHits
                      ? "Sequential ahead"
                      : "AI ahead"
                    : metricsSmart.totalHits >= metricsSeq.totalHits
                      ? "AI ahead"
                      : "Sequential ahead"
                }</div>
                <div class="metric-detail">Total intercept spread: ${Math.abs(metricsSmart.totalHits - metricsSeq.totalHits)} hits</div>
              </div>
            </div>

            <div class="panel">
              <div class="chip">Signal performance timeline</div>
              <table>
                <thead>
                  <tr>
                    <th>Tick</th>
                    <th>Sequential</th>
                    <th>AI Smart</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AEGIS_Scan_Benchmark_Report.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeMetrics = useMemo(() => {
    if (strategy === "sequential") return metricsSeq;
    if (strategy === "ai-smart") return metricsSmart;
    return metricsSmart;
  }, [strategy, metricsSeq, metricsSmart]);

  const activeBands = useMemo(() => {
    if (strategy === "sequential")
      return [
        {
          index: receiverBandSeq,
          color: "border-orange-500",
          bg: "bg-orange-500/20",
        },
      ];
    if (strategy === "ai-smart")
      return [
        {
          index: receiverBandSmart,
          color: "border-emerald-500",
          bg: "bg-emerald-500/20",
        },
      ];
    return [
      {
        index: receiverBandSeq,
        color: "border-orange-500",
        bg: "bg-orange-500/20",
      },
      {
        index: receiverBandSmart,
        color: "border-emerald-500",
        bg: "bg-emerald-500/20",
      },
    ];
  }, [strategy, receiverBandSeq, receiverBandSmart]);

  const activeHitMarkers = useMemo(() => {
    if (strategy === "sequential")
      return hitMarkersSeq.map((m) => ({ ...m, type: "seq" }));
    if (strategy === "ai-smart")
      return hitMarkersSmart.map((m) => ({ ...m, type: "smart" }));
    return [
      ...hitMarkersSeq.map((m) => ({ ...m, type: "seq" })),
      ...hitMarkersSmart.map((m) => ({ ...m, type: "smart" })),
    ];
  }, [strategy, hitMarkersSeq, hitMarkersSmart]);

  if (!currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authError={authError}
      />
    );
  }

  if (view === "login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authError={authError}
      />
    );
  }

  if (view === "landing") {
    return (
      <LandingPage
        onContinue={() => setView("dashboard")}
        onLogout={handleLogout}
      />
    );
  }

  if (view === "report") {
    return (
      <ReportPage
        currentTick={currentTick}
        chartData={chartData}
        metricsSeq={metricsSeq}
        metricsSmart={metricsSmart}
        noiseLevel={noiseLevel}
        radcharProfile={radcharProfile}
        onBack={() => setView("dashboard")}
        onDownloadReport={handleDownloadReport}
      />
    );
  }

  const compareMetrics = strategy === "compare" ? metricsSeq : null;

  return (
    <DashboardPage
      simulationStatus={simulationStatus}
      strategy={strategy}
      emitters={emitters}
      frequencyBands={frequencyBands}
      noiseLevel={noiseLevel}
      simSpeed={simSpeed}
      grid={grid}
      currentTick={currentTick}
      chartData={chartData}
      eventLogs={eventLogs}
      onStrategyChange={setStrategy}
      onStart={handleStart}
      onPause={handlePause}
      onReset={handleReset}
      onEmittersChange={setEmitters}
      onFrequencyBandsChange={setFrequencyBands}
      onNoiseLevelChange={setNoiseLevel}
      onSimSpeedChange={setSimSpeed}
      onSelectScenario={handleSelectScenario}
      onDownloadReport={handleDownloadReport}
      onOpenReport={() => setView("report")}
      radcharProfile={radcharProfile}
      activeMetrics={activeMetrics}
      activeBands={activeBands}
      activeHitMarkers={activeHitMarkers}
      compareMetrics={compareMetrics}
      onLogout={handleLogout}
    />
  );
}

export default App;
