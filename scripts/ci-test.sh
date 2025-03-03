#!/bin/bash
set -e

# Print commands for debugging
set -x

# Install dependencies
npm ci

# Run linting
npm run lint

# Run unit tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e

echo "All tests passed!" 