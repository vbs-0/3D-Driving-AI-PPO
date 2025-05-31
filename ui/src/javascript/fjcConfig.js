const fjcConfig = {
  debug: false,
  cyberTruck: true,
  panEnabled: false,
  defaultZoomValue: -0.4,
  masterVolume: 1,
  carStartingPosition: [0, 0, 48],
  deathPositionZ: 14,
  gravityZ: -3,
  pointsForLine: {
    // Modern F1-style track layout with more technical sections
    0: { x: 0, y: 0, z: 36 },
    1: { x: -40, y: 0, z: 36 }, // First straight
    2: { x: -60, y: 20, z: 36 }, // Smooth curve into
    3: { x: -60, y: 40, z: 36 }, // Technical section start
    4: { x: -40, y: 50, z: 36 },
    5: { x: -20, y: 40, z: 36 }, // Chicane
    6: { x: -20, y: 60, z: 36 },
    7: { x: -40, y: 70, z: 36 }, // Hairpin
    8: { x: -60, y: 60, z: 36 },
    9: { x: -80, y: 40, z: 36 }, // Long curve
    10: { x: -80, y: 0, z: 36 },
    11: { x: -60, y: -20, z: 36 }, // Back straight entry
    12: { x: -40, y: -20, z: 36 }, // Back straight
    13: { x: -20, y: -20, z: 36 },
    14: { x: 0, y: -20, z: 36 },
    15: { x: 20, y: -10, z: 36 }, // Final corner
    16: { x: 20, y: 0, z: 36 },
    17: { x: 0, y: 0, z: 36 } // Finish line
  },
}

module.exports = fjcConfig;

export default fjcConfig