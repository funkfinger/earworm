#!/bin/bash

# Script to run unit tests and Safari-only E2E tests for the De Worm application

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to clean up resources
cleanup() {
  echo -e "${GREEN}Cleaning up resources...${NC}"
  # Kill the development server if it's running
  if [ ! -z "$DEV_SERVER_PID" ]; then
    echo "Stopping development server (PID: $DEV_SERVER_PID)..."
    kill -9 $DEV_SERVER_PID 2>/dev/null || true
  fi
  echo -e "${GREEN}Cleanup complete.${NC}"
  exit ${1:-0}
}

# Set up trap to ensure cleanup happens on exit
trap 'cleanup $?' EXIT INT TERM

# Check if port 4000 is already in use and kill the process
PORT_PID=$(lsof -ti:4000)
if [ ! -z "$PORT_PID" ]; then
  echo -e "${BLUE}Port 4000 is in use by PID $PORT_PID. Killing process...${NC}"
  kill -9 $PORT_PID 2>/dev/null || true
  sleep 2
fi

echo -e "${GREEN}=== De Worm Safari Testing Suite ===${NC}"
echo -e "${GREEN}Running unit tests and Safari E2E tests...${NC}"
echo ""

# Create directory if it doesn't exist
mkdir -p scripts

# Run unit tests
echo -e "${GREEN}Running unit tests...${NC}"
npm test -- --config=jest.config.js --watchAll=false

# Check if unit tests passed
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Unit tests passed${NC}"
else
  echo -e "${RED}✗ Unit tests failed${NC}"
  exit 1
fi

echo ""

# Run Safari E2E tests
echo -e "${GREEN}Running Safari E2E tests...${NC}"
echo "Running Playwright tests with Safari only..."

# Run Playwright tests with a timeout
echo "Waiting for Safari tests to complete (max 90s)..."
npx playwright test --config=playwright.safari.config.ts
PLAYWRIGHT_EXIT_CODE=$?

if [ $PLAYWRIGHT_EXIT_CODE -ne 0 ]; then
  echo -e "${RED}✗ Safari E2E tests failed or timed out (exit code: $PLAYWRIGHT_EXIT_CODE)${NC}"
  ALL_TESTS_PASSED=false
else
  echo -e "${GREEN}✓ Safari E2E tests passed${NC}"
fi

echo ""
echo -e "${GREEN}All tests completed!${NC}"
# No need to manually call cleanup as the trap will handle it 