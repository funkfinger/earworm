import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a schema using the a.* functions from the
Amplify backend libraries.

The schema defines the data model, which Amplify uses to store data in a
database, generate GraphQL APIs, and more.
=========================================================================*/
const data = defineData({
  schema: ({ auth }) => ({
    User: a
      .model({
        id: a.id().required(),
        email: a.string().required(),
        name: a.string(),
        earworms: a.hasMany("Earworm", "userId"),
      })
      .authorization(auth.rules().groups(["admin"]).ownerField("id")),

    Earworm: a
      .model({
        id: a.id().required(),
        userId: a.string().required(),
        stuckSongTitle: a.string().required(),
        stuckSongArtist: a.string().required(),
        replacementSongTitle: a.string(),
        replacementSongArtist: a.string(),
        replacementSongId: a.string(),
        wasEffective: a.boolean(),
        timestamp: a.string().required(),
        user: a.belongsTo("User", "userId"),
      })
      .authorization(auth.rules().groups(["admin"]).ownerField("userId")),
  }),
});

// Export the Schema type for use in the client
export type Schema = ClientSchema<typeof data>;

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
type-safe client with:

```ts
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();
```

This will generate a fully typed client that you can use to interact with your
backend.
=========================================================================*/

export default data;
