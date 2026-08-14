// Approximation: transcribed from docs/score-strategist-dev-spec.md's
// illustrative model, not calibrated against real Bluebook curve data.
// Calibration is a separate, later pass.
export const ENGINE_CONFIG = {
  rw: { m1Questions: 27, m2Questions: 27, routingThreshold: 18 },
  math: { m1Questions: 22, m2Questions: 22, routingThreshold: 14 },
  easyRouteCap: { rw: 630, math: 630 },
  scoreBand: 30,
  anchors: {
    hard: {
      rw: [
        [54, 800],
        [48, 720],
        [40, 620],
        [30, 480],
        [18, 350],
      ],
      math: [
        [44, 800],
        [39, 720],
        [32, 600],
        [24, 470],
        [14, 340],
      ],
    },
    easy: {
      rw: [
        [54, 630],
        [40, 540],
        [27, 430],
        [14, 320],
        [0, 200],
      ],
      math: [
        [44, 630],
        [33, 540],
        [22, 430],
        [11, 320],
        [0, 200],
      ],
    },
  },
} as const;
