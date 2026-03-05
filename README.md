# Connect 4

This webapp is run on NextJS app router: https://nextjs.org/docs.

The app can be characterised by a few important files:

- app/components/Grid.tsx, which displays the connect 4 grid
- app/lib/connect4Controller, which controls game logic
- app/api/games/route.ts, which defines the API used to interact with the database.

## Setup

- Install packages:

```bash
npm install
```

- Run the webapp in dev:

```bash
npm run dev
```

This allows changes to be automatically picked up.

- Run unit tests like:

```bash
npm run test
```

- Run the linter (this formats the code):

```bash
npm run lint
```

## Task

You should be able to follow the tasks all the way through here:

[Tasks document](./TASK.md)
