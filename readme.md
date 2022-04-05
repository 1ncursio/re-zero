# Lathello

<img src="./gameplay.gif"></img>

Lathello is a web application that can play Reversi against AI based on the AlphaZero (AZ) algorithm.

> Note: Lathello is a work in progress. In the future, Lathello will be able to play against other players.

## Features

- Play against AZ
- You can also write posts and comments on the community

## Architecture

<img src="./architecture.png"></img>

## Folder Structure

```bash
.
├── alphazero                   # AlphaZero
│   ├── app.py                  # Flask application (no longer used)
│   ├── dual_network.py         # Dual network that outputs the policy and value using ResNet
│   ├── evaluate_best_player.py # Evaluate the best player
│   ├── evaluate_network.py     # Evaluate the network
│   ├── game.py                 # Reversi game logic
│   ├── human_play.py           # Human play
│   ├── pv_mcts.py              # PV MCTS algorithm
│   ├── self_play.py            # Self play
│   ├── train_cycle.py          # Train cycle
│   ├── train_network.py        # Train network
│   └── model                   # Trained best model
│       └── best.h5
│
├── server                      # Laravel server
│   └── ...
├── webapp                      # React web application
│   ├── public                  # Static files
│   └── src
│       ├── components          # React components
│       ├── lib
│       │   ├── api             # Ajax calls to the server
│       │   ├── othello         # Reversi game logic for the webapp
│       │   └── ...
│       ├── pages               # React pages
│       ├── store               # Zustand store (Does not used yet)
│       ├── assets              # React assets
│       ├── hooks               # React hooks
│       ├── typings             # type definitions
│       └── ...
└── README.md
```

## Project Stack

### Frontend

- React
- React Router
- TypeScript
- SWR
- Tailwind CSS
- Emotion

### Backend

- PHP
- Laravel
- Google OAuth 2.0

### AlphaZero

- Python
- TensorFlow
- Keras
- NumPy

## Future Plans

- [ ] Refactor the code to use the Zustand
- [ ] Deploy the project
- [ ] Add multi-player mode
- [ ] Change Backend Framework (e.g. Nest.js, fastify, django, etc.)
- [ ] Support i18n
- [ ] Support PWA
