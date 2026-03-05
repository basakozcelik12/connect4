# Task

## Learning Objectives

- React/ NextJS
- REST APIs
- Databases
- Object-relational mappers (ORMs)

## Tasks

### 1. Implement making a move

#### Background

The Connect 4 grid doesn’t input new tokens as it stands. From the code, you can see we have a grid which

#### Task

- Validate column input
- Find the lowest row
- Place a counter
- Change player
- Add unit tests

#### Acceptance criteria

- Users can place a counter in the connect 4 grid
- Users cannot place it outside of the grid
- Users cannot place it on a full column
- Player switches once a token is played

#### Extra

Why do we want to have the useState hook for gameStatus?

---

### 2. Create a win condition

#### Background

As it stands, the user can place tokens into the connect 4 grid, but cannot win! This is a little Leetcode-esque, but I would like for you to make a method which checks for a win and a draw!

#### Task

- Create a method of a user winning or drawing
- Use GameStatus to display a winning/ draw message

#### Acceptance criteria

- As a player, I must be able to win by connecting 4 tokens in a row
- As a player, I must be able to draw if my competitor and I cannot win
- As a player, I should be able to see a message based on the win/ draw

---

### 3. Create a reset button

#### Background

We currently have a game, but no way of simply restarting it without refreshing the page.

#### Task

- Add a React component, allowing us to restart the game

#### Acceptance criteria

- Users can restart games without needing to refresh the page

---

### 4. Update the database with scores

#### Background

I have built a POST endpoint which updates the database with the scores using the Prisma ORM.

You will need to create a database in PgAdmin before starting this task!

#### Task

Look at the Prisma schema, and understand how the ORM works ([docs](https://www.prisma.io/docs "‌")).

1. Update the `.env` >`DATABASE_URL` with the credentials from PgAdmin
2. Run the database migration (see `package.json` for the script)
3. Use Postman/ curl to test the endpoint
4. Use SQL select \* in PgAdmin to check the test
5. Update `makeMove` to automatically upload wins/ draws

#### Acceptance criteria

- As a player, completed games automatically get uploaded to the database

---

### 5. Create a stats page based on past scores

#### Background

We now have a database with data uploaded from games played. We want to do more with that information, letting the user see those games.

In the starter code, there should be a template Stats page.

#### Task

Look into, then implement a way to display the stats on this page. Start off with:

- Summarise total wins by player and draws
- List games, and who won and when.

#### Acceptance criteria

- As a player, I must see total wins/ losses/ draws, and listed games, in the stats page.

---

### 6. Add game # moves and avg to stats page

#### Background

The stats page looks a little light, we could add some more details here!

You might already be keeping track of the move count for checking for the draw condition. It would be nice to add that statistic to the stats page.

#### Task

- Add in how many goes it took each game took to finish in.

#### Acceptance criteria

- As a player, I should see the number of moves each game took in the stats page.

---

### 7. Use GitHub Actions to automatically test changes

#### Background

We have a fully functioning game, but how do we stop future developers leading the code astray?

#### Task

Use Github Actions to automatically run the unit tests on pushes

#### Acceptance criteria

- As a developer, I must have Github run the unit tests automatically when a developer pushes changes to the repository.

---

### 8. Use browser storage to keep game state

#### Background

We have a functioning game, but we can make sure we don’t lose progress from a page refresh!

#### Task

Using Local Storage, ensure the game state is saved, so the players can come back to the game even after a refresh!

#### Acceptance criteria

- As a player, the game should persist through a refresh!

---

### 9. Enable online multiplayer with Redis

#### Background

We have a fully-functioning game whereby players can “pass-and-play”. This is all very cool, but let’s say the client wants to go further. They might like the idea of playing each other at the same time.

How is this possible? At the moment, the state of the game is stored in the browser (`this.board` and `gameStatus`). This won’t do, since we’re trying to let separate browsers/ machines play the same game.

We _could_ store the state in our database in a table… or we could go for gold. It is possible to use an in-memory database like Redis and web sockets to play at the same time.

#### Task

Using AI tools to help you, look for a way to connect players over Redis. Remove the summary stats in the stats view, since that gets a little complicated, but keep the individual game results.

Your trainer will specify the Redis access.

#### Acceptance criteria

- A player can create a game
- Another player can join a game
- Games can be played like normal
- Stats only shows a list of played games
