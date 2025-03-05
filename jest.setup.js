// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock the next/router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock the Amplify client
jest.mock("@/utils/amplifyClient", () => ({
  client: {
    models: {
      User: {
        create: jest.fn(),
        get: jest.fn(),
        list: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      },
      Earworm: {
        create: jest.fn(),
        get: jest.fn(),
        list: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      },
    },
  },
}));

// Mock the Amplify auth
jest.mock("aws-amplify/auth", () => ({
  signIn: jest.fn(),
  signUp: jest.fn(),
  confirmSignUp: jest.fn(),
  getCurrentUser: jest.fn(),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Setup for testing environment
beforeAll(() => {
  // Global setup before all tests
});

afterAll(() => {
  // Global cleanup after all tests
});

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
