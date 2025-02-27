# README

I am making an app that deals with songs stuck in a person head called **De Worm** - a song stuck in your head is referred to as an ear worm - hence the name. The app will ask you to do a couple of somewhat meaningless tasks and then play a song that is equally or even more catchy - with the idea that this song will replace the song that is stuck in the person's head and therefore "fix" the users problem.

The opening page of the app should be of our mascot "QT", a cute pink worm character with a happy face and friendly outgoing demeanor. QT will greet you and feel bad for you that you are experiencing an ear worm. First they will ask that you log into either Spotify or Apple music and have you find the song that is causing them harm. They will then ask you to do a breathing exercise or a visualization exercise or something similar. After which they will play a song from the users audio streaming service which is equally or even more catchy. This list of ear worm worthy songs will be a playlist that is replicated in the streaming service. The song they originally entered will also be added to this playlist but not played back to them at this time.

The app will keep track of the user based on the streaming service that they logged in as and will keep a record of any ear worm songs they enter.

The app will keep a database of the songs with a count of how many users enter the track and how many times the track has been used to replace an ear worm. The track will also keep a table of users and what they have added to the ear worm database and what ear worm replacement songs they have been given. This will be useful as to not repeat replacement songs to the users.

There will be a full suite of unit and end to end tests created either by AI or by me the author.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
