"use client";

import { Amplify } from "aws-amplify";
import { ReactNode, useEffect, useState } from "react";

// This component initializes Amplify for the application
export default function AmplifyProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize Amplify with the configuration from the sandbox
    const initializeAmplify = async () => {
      try {
        // In a real app, we would fetch this from the amplify_outputs.json
        // For now, we'll use the values directly from the sandbox output
        Amplify.configure(
          {
            // Configure Auth
            Auth: {
              Cognito: {
                userPoolId: "us-east-1_wXljgt1pN",
                userPoolClientId: "7h0p1togucbc44k5nu5a7dm1po",
                identityPoolId:
                  "us-east-1:2f7d63ed-038f-43e6-a62c-1daccf3a2c6a",
              },
            },
            // Configure API
            API: {
              GraphQL: {
                endpoint:
                  "https://ek3tegpo6rf3rp7x2etdyblh3e.appsync-api.us-east-1.amazonaws.com/graphql",
                region: "us-east-1",
                defaultAuthMode: "userPool",
              },
            },
          },
          {
            ssr: true,
          }
        );

        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing Amplify:", error);
      }
    };

    initializeAmplify();
  }, []);

  // Only render children once Amplify is initialized
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
