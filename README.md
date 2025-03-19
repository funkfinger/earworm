# De Worm - Earworm Cure App

**De Worm** is an NextJS 15.2.3 app that helps with songs stuck in your head (referred to as an "ear worm"). The app will ask you to search for the song that's stuck in your head and then play a song that is equally or even more catchy - with the idea that this new song will replace the stuck song and "fix" your problem.

## App Overview

The opening page features our mascot "QT", a cute pink worm character with a happy face and friendly outgoing demeanor. QT will:

1. Greet you and sympathize with your earworm problem
2. Ask you to log into Spotify (Apple Music in future)
3. Help you find the song that's stuck in your head
4. Play a replacement song from the playlist https://open.spotify.com/playlist/0E9WYGYWZBqfmp6eJ0Nl1t?si=55d3bde342094dc2
5. Follow up to see if the solution worked

The app keeps a record of users' earworm history and replacement songs, with a database tracking:

- How many users have the same earworm
- How effective each replacement song is
- User history to avoid repeating replacement songs

## Implementation Decisions

Based on project requirements and planning discussions, the following implementation decisions have been made:

### Song Selection

- Replacement songs will be played exclusively from the specified Spotify playlist: https://open.spotify.com/playlist/0E9WYGYWZBqfmp6eJ0Nl1t
- Any new earworm songs that users report will be added to this playlist for future use

### Effectiveness Tracking

- A simple yes/no response system will be used to track the effectiveness of replacement songs
- This data will be stored to improve future recommendations

### Database

- A simple database interface will be implemented using Amazon DynamoDB
- The database will track user history, earworm frequency, and replacement song effectiveness

### Authentication

- Spotify OAuth will be used exclusively for authentication
- The architecture will be designed to support Apple Music integration in the future

### User Interface

- The existing mascot SVG (public/images/mascot.svg) will be used throughout the app
- Standard cookie consent mechanisms will be implemented to comply with privacy regulations
- The UI will follow the hand-drawn aesthetic specified in the design requirements

## Getting Started

### Environment Setup

1. Create a `.env.local` file in the project root with the following variables - note the correct URL for the callback from Spotify:

```
# Spotify API credentials
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Optional variables
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

2. Get your Spotify API credentials:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
   - Create a new application
   - Get your Client ID and Client Secret
   - Add `http://localhost:3000/api/auth/callback` as a Redirect URI in your Spotify app settings

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

This project uses Jest for unit tests and Playwright for E2E tests, following test-driven development practices.

### Running Tests

```bash
# Run unit tests
npm test -- --config=jest.config.js

# Run unit tests in watch mode
npm test -- --config=jest.config.js --watch

# Run end-to-end tests
npx playwright test

# Run all tests (unit and E2E)
./scripts/run-tests.sh
```

### Test Structure

- Unit tests are located in `src/app/__tests__/` directory
- E2E tests are located in the `e2e/tests/` directory
- Mock services for testing are in `src/app/__tests__/mocks/`

For detailed information about the testing approach, see [TESTING.md](TESTING.md).

## CI/CD

This project uses GitHub Actions for continuous integration and delivery. The workflow:

1. Runs on pushes to main branch and pull requests
2. Tests the code:
   - Linting
   - Unit tests with Jest
   - E2E tests with Playwright
3. Builds the application if all tests pass

To test the CI/CD pipeline locally, run:

```bash
./scripts/ci-test.sh
```

This will simulate the CI environment on your local machine.

### GitHub Actions Setup

The CI/CD pipeline is defined in `.github/workflows/main.yml`. To use it:

1. Push your code to GitHub
2. Set up repository secrets in your GitHub repository:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add the following repository secrets:
     - `SPOTIFY_CLIENT_ID`: Your Spotify application client ID
     - `SPOTIFY_CLIENT_SECRET`: Your Spotify application client secret
     - `SPOTIFY_REDIRECT_URI`: Your Spotify application redirect URI (e.g., `https://your-deployed-app.com/api/auth/callback`)
3. GitHub Actions will automatically run the pipeline
4. View results in the Actions tab of your repository

## Deployment

Deployment will be configured in the GitHub Actions workflow once we have a target hosting platform.

## Prompt for AI

Please create a single page mobile-first "Ear Worm" solver app.

The app should work as a guided "expert system" hosted by a cute worm character (attached) named "QT". QT in fun and cute way steps the user through a process. The steps to this process are as follow and are in this order:

1. splash screen
2. welcome screen
3. Spotify login in screen
4. search screen
5. random song playback screen
6. confirmation that the song played screen
7. return to the search screen

The colors for the app are brown (background) pink (most text and elements) and yellow (highlights and whatnot). THe style of the site is cute, and fun. Typefaces should look hand-drawn and simple. Lines if possible are squiggly and have a hand-drawn look. Animations should be cute and quirky with possibly a bounce and settle effect.

The app will need to address confirmation and error cases with elements such as dialog boxes and buttons. When possible these should be removed after a short time. Error and confirmation elements should be colored normally and not follow the sites colors.

### Fonts and Color:

- font: Playpen Sans
- background color: #4e342e
- text color: #ddd2a7
- highlight color: #ef798a
- accent color a: #727d71
- accent color b: #586f7c

All UI elements should have the hand-drawn CSS techniques from http://fxaeberhard.github.io/handdrawn.css/

### Technology

- Next.js 15.2.3
- Tailwind CSS 4
- shadcn UI 2.3.0
- Radix UI 3.1.3
- Spotify Web Playback SDK: https://developer.spotify.com/documentation/web-playback-sdk

NOTE: The app should not use the **deprecated** Spotify preview functionality - https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api - but rather it should use the Spotify Web Playback SDK

NOTE: The app is a Next.js 15 app. Please make sure all code is compatible with version 15

#### Deployment

- Hosting: Amazon AWS Amplify Gen 2
- Database: Amazon DynamoDB
- Domain Name: deworm.us

### Users & Data

- all user authentication should happen by logging into Spotify - there is no need to create users elsewhere
- A simple database should hold the users who have used the site and what their earworm and replacement songs are
- I will ask AI for what SAS database to implement based on low cost and likely low usage
- If there are any laws around getting authorization by the users to use their data (ie cookies), the app should satisfy all legal requirements

### Roadmap

- Add Apple Music integration as an alternative to Spotify
- Create both iOS and Android versions of the application and list them in their respective app stores
