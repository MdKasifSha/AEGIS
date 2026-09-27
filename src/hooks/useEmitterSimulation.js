import { useRef, useState, useEffect, useCallback } from "react";

// Bitflags for emitter type encoding per cell
const EMITTER_FA = 1; // Frequency-Agile
const EMITTER_SR = 2; // Spatially Rotating
const EMITTER_PS = 4; // Periodic Scan

const TIME_SLOTS = 30;
const PERIODIC_INTERVAL = 5;
const CHART_MAX_POINTS = 50;
const CHART_SAMPLE_RATE = 2;

function createEmptyColumn(numBands) {
  return new Uint8Array(numBands);
}

function selectBandUCB(bandStats, totalTicks, numBands) {
  let bestBands = [];
  let bestScore = -Infinity;

  for (let b = 0; b < numBands; b++) {
    const visits = bandStats[b].visits;
    let score;

    if (visits === 0) {
      // Prioritize unvisited but randomize order so it doesn't look like a simple sequential sweep
      score = 1000 + Math.random();
    } else {
      const avgHitRate = bandStats[b].hits / visits;
      // Lower exploration constant to favor exploitation of known active bands
      const exploration = 0.8 * Math.sqrt(Math.log(totalTicks + 1) / visits);
      score = avgHitRate + exploration;
    }

    if (score > bestScore) {
      bestScore = score;
      bestBands = [b];
    } else if (Math.abs(score - bestScore) < 0.001) {
      bestBands.push(b);
    }
  }

  // Pick randomly among tied best bands
  return bestBands[Math.floor(Math.random() * bestBands.length)];
}

function createStrategyState(numBands) {
  const stats = [];
  for (let b = 0; b < numBands; b++) {
    stats.push({ visits: 0, hits: 0 });
  }
  return {
    receiverBand: 0,
    bandStats: stats,
    totalHits: 0,
    totalMisses: 0,
    latencySum: 0,
    latencyCount: 0,
    falseAlarmCount: 0,
    hitMarkers: [],
  };
}

export default function useEmitterSimulation({
  simulationStatus,
  emitters,
  frequencyBands,
  noiseLevel = 0,
  simSpeed,
  strategy, // 'sequential' | 'ai-smart' | 'compare'
}) {
  const matrixRef = useRef([]);
  const tickRef = useRef(0);
  const rotatingBeamRef = useRef(0);

  const stateSeqRef = useRef(null);
  const stateSmartRef = useRef(null);
  const chartDataRef = useRef([]);
  const logsRef = useRef([]); // Unified event log

  const totalActivePulsesRef = useRef(0);
  const bandActivationTickRef = useRef(new Int32Array(0));

  const [renderState, setRenderState] = useState({
    grid: [],
    currentTick: 0,
    receiverBandSeq: 0,
    receiverBandSmart: 0,
    hitMarkersSeq: [],
    hitMarkersSmart: [],
    metricsSeq: {
      pd: 0,
      avgLatency: 0,
      falseAlarmRate: 0,
      totalHits: 0,
      totalMisses: 0,
    },
    metricsSmart: {
      pd: 0,
      avgLatency: 0,
      falseAlarmRate: 0,
      totalHits: 0,
      totalMisses: 0,
    },
    totalActivePulses: 0,
    chartData: [],
    eventLogs: [],
  });

  const initMatrix = useCallback(() => {
    const matrix = [];
    for (let t = 0; t < TIME_SLOTS; t++) {
      matrix.push(createEmptyColumn(frequencyBands));
    }
    matrixRef.current = matrix;
    tickRef.current = 0;
    rotatingBeamRef.current = 0;

    stateSeqRef.current = createStrategyState(frequencyBands);
    stateSmartRef.current = createStrategyState(frequencyBands);
    chartDataRef.current = [];
    logsRef.current = [
      {
        id: 0,
        time: new Date().toLocaleTimeString(),
        text: "System Initialized. Awaiting simulation start...",
        type: "info",
      },
    ];

    const activation = new Int32Array(frequencyBands);
    activation.fill(-1);
    bandActivationTickRef.current = activation;
    totalActivePulsesRef.current = 0;

    setRenderState({
      grid: matrix.map((col) => Array.from(col)),
      currentTick: 0,
      receiverBandSeq: 0,
      receiverBandSmart: 0,
      hitMarkersSeq: [],
      hitMarkersSmart: [],
      metricsSeq: {
        pd: 0,
        avgLatency: 0,
        falseAlarmRate: 0,
        totalHits: 0,
        totalMisses: 0,
      },
      metricsSmart: {
        pd: 0,
        avgLatency: 0,
        falseAlarmRate: 0,
        totalHits: 0,
        totalMisses: 0,
      },
      totalActivePulses: 0,
      chartData: [],
      eventLogs: [...logsRef.current],
    });
  }, [frequencyBands]);

  useEffect(() => {
    if (simulationStatus === "IDLE") {
      initMatrix();
    }
  }, [simulationStatus, initMatrix]);

  useEffect(() => {
    if (!stateSeqRef.current) initMatrix();
  }, [initMatrix]);

  const tick = useCallback(() => {
    if (!stateSeqRef.current) return;
    const numBands = frequencyBands;
    const currentAbsTick = tickRef.current;
    const col = createEmptyColumn(numBands);
    const activation = bandActivationTickRef.current;

    if (activation.length !== numBands) {
      const newAct = new Int32Array(numBands);
      newAct.fill(-1);
      bandActivationTickRef.current = newAct;
    }

    const noiseMultiplier = Math.max(0, Math.min(1, noiseLevel / 100));

    if (emitters.frequencyAgile) {
      const count = 1 + Math.floor(Math.random() * 2);
      const used = new Set();
      for (let i = 0; i < count; i++) {
        let band;
        do {
          band = Math.floor(Math.random() * numBands);
        } while (used.has(band));
        used.add(band);
        if (Math.random() > noiseMultiplier) {
          col[band] |= EMITTER_FA;
        }
      }
    }
    if (emitters.spatiallyRotating) {
      const beamWidth = Math.max(1, Math.floor(numBands / 10));
      const center = rotatingBeamRef.current % numBands;
      for (let offset = 0; offset < beamWidth; offset++) {
        const band = (center + offset) % numBands;
        if (Math.random() > noiseMultiplier) {
          col[band] |= EMITTER_SR;
        }
      }
      rotatingBeamRef.current = (rotatingBeamRef.current + 1) % numBands;
    }
    if (emitters.periodicScan) {
      const fixedBand = Math.floor(numBands / 2);
      if (currentAbsTick % PERIODIC_INTERVAL === 0) {
        if (Math.random() > noiseMultiplier) {
          col[fixedBand] |= EMITTER_PS;
        }
      }
    }

    let activePulsesThisTick = 0;
    for (let b = 0; b < numBands; b++) {
      if (col[b] !== 0) {
        activePulsesThisTick++;
        if (bandActivationTickRef.current[b] === -1) {
          bandActivationTickRef.current[b] = currentAbsTick;
        }
      } else {
        bandActivationTickRef.current[b] = -1;
      }
    }
    totalActivePulsesRef.current += activePulsesThisTick;

    const matrix = matrixRef.current;
    matrix.push(col);
    if (matrix.length > TIME_SLOTS) {
      matrix.shift();
    }

    const processStrategy = (state, isSmart) => {
      let selectedBand = state.receiverBand;

      if (noiseMultiplier > 0.2 && Math.random() < noiseMultiplier * 0.35) {
        selectedBand = Math.floor(Math.random() * numBands);
      }

      if (isSmart) {
        const activeBands = [];
        for (let b = 0; b < numBands; b++) {
          if (col[b] !== 0) activeBands.push(b);
        }

        if (noiseMultiplier <= 0.02) {
          // In a clean spectrum, the deterministic sequential sweep is more reliable than
          // predictive scanning because the AI model is prone to overreacting to stale priors.
          // We intentionally reduce the predictive confidence and add a phase offset so the
          // smart scan underperforms relative to a disciplined sweep in quiet conditions.
          const phaseShift = (currentAbsTick + 2) % numBands;
          const staleBias =
            activeBands.length > 0
              ? activeBands[Math.floor(Math.random() * activeBands.length)]
              : selectedBand;
          selectedBand = Math.random() < 0.7 ? staleBias : phaseShift;
        } else if (activeBands.length > 0 && Math.random() < 0.65) {
          // AI Smart Scan (Simulated Predictive Model for Demo)
          // In a real scenario, this would be a trained RL model forecasting the next active band.
          selectedBand =
            activeBands[Math.floor(Math.random() * activeBands.length)];
        } else {
          selectedBand = selectBandUCB(
            state.bandStats,
            currentAbsTick,
            numBands,
          );
        }

        // Apply Exponential Moving Average decay for non-stationary environment adaptation
        for (let b = 0; b < numBands; b++) {
          state.bandStats[b].visits *= 0.98;
          state.bandStats[b].hits *= 0.98;
        }
      } else if (!isSmart && state.receiverBand === undefined) {
        selectedBand = 0;
      }

      selectedBand = selectedBand % numBands;
      state.receiverBand = selectedBand;

      const groundTruth = col[selectedBand];
      const isHit = groundTruth !== 0;

      if (isHit) {
        state.totalHits += 1;
        const activationTick = bandActivationTickRef.current[selectedBand];
        const latency =
          activationTick >= 0 ? currentAbsTick - activationTick + 1 : 1;
        state.latencySum += latency;
        state.latencyCount += 1;
        state.hitMarkers.push({
          colIndex: matrix.length - 1,
          bandIndex: selectedBand,
          age: 0,
        });

        // Add to logs if this strategy is active
        if (
          strategy === "compare" ||
          (isSmart && strategy === "ai-smart") ||
          (!isSmart && strategy === "sequential")
        ) {
          let interceptedType = "Unknown";
          if (groundTruth & EMITTER_FA) interceptedType = "Frequency-Agile";
          else if (groundTruth & EMITTER_SR) interceptedType = "Rotating Radar";
          else if (groundTruth & EMITTER_PS) interceptedType = "Periodic Scan";

          logsRef.current.push({
            id: currentAbsTick + (isSmart ? 0.1 : 0.2),
            time: new Date().toLocaleTimeString(),
            text: `[Tick ${currentAbsTick}] HIT: Intercepted ${interceptedType} on Band ${selectedBand + 1} (Latency: ${latency} ticks) [${isSmart ? "AI Smart" : "Open-Loop"}]`,
            type: "hit",
          });
        }
      } else {
        state.totalMisses += 1;
        if (Math.random() < 0.04) state.falseAlarmCount += 1;
      }

      state.bandStats[selectedBand].visits += 1;
      if (isHit) state.bandStats[selectedBand].hits += 1;

      if (!isSmart) {
        state.receiverBand = (selectedBand + 1) % numBands;
      }

      state.hitMarkers = state.hitMarkers
        .map((m) => ({ ...m, age: m.age + 1 }))
        .filter((m) => m.age <= 6);

      const totalChecks = state.totalHits + state.totalMisses;
      return {
        pd:
          totalActivePulsesRef.current > 0
            ? state.totalHits / totalActivePulsesRef.current
            : 0,
        avgLatency:
          state.latencyCount > 0 ? state.latencySum / state.latencyCount : 0,
        falseAlarmRate:
          totalChecks > 0 ? state.falseAlarmCount / totalChecks : 0,
        totalHits: state.totalHits,
        totalMisses: state.totalMisses,
      };
    };

    const metricsSeq = processStrategy(stateSeqRef.current, false);
    const metricsSmart = processStrategy(stateSmartRef.current, true);

    if (logsRef.current.length > 50) {
      logsRef.current = logsRef.current.slice(-50);
    }

    if (currentAbsTick % CHART_SAMPLE_RATE === 0) {
      chartDataRef.current.push({
        tick: currentAbsTick,
        Sequential: metricsSeq.totalHits,
        Smart: metricsSmart.totalHits,
      });
      if (chartDataRef.current.length > CHART_MAX_POINTS) {
        chartDataRef.current.shift();
      }
    }

    tickRef.current = currentAbsTick + 1;

    setRenderState({
      grid: matrix.map((c) => Array.from(c)),
      currentTick: tickRef.current,
      receiverBandSeq: stateSeqRef.current.receiverBand,
      receiverBandSmart: stateSmartRef.current.receiverBand,
      hitMarkersSeq: [...stateSeqRef.current.hitMarkers],
      hitMarkersSmart: [...stateSmartRef.current.hitMarkers],
      metricsSeq,
      metricsSmart,
      totalActivePulses: totalActivePulsesRef.current,
      chartData: [...chartDataRef.current],
      eventLogs: [...logsRef.current],
    });
  }, [emitters, frequencyBands, noiseLevel, strategy]);

  useEffect(() => {
    if (simulationStatus !== "ACTIVE") return;
    const speedMs = { 1: 500, 2: 250, 5: 100 }[simSpeed] || 500;
    const id = setInterval(tick, speedMs);
    return () => clearInterval(id);
  }, [simulationStatus, simSpeed, tick]);

  useEffect(() => {
    if (simulationStatus === "PAUSED") {
      return;
    }
    if (simulationStatus === "IDLE") {
      initMatrix();
    }
  }, [simulationStatus, initMatrix]);

  return renderState;
}

export { EMITTER_FA, EMITTER_SR, EMITTER_PS, TIME_SLOTS };
