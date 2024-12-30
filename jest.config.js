module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverage: true,
    coverageThreshold: {
      global: {
        lines: 80,
      },
    },
    roots: ['<rootDir>/src/tests'], // Actualiza la ruta a tu carpeta de pruebas
  };
  