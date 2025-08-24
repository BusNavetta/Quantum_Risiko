# Quantum Game Project

A multiplayer quantum-themed strategy game built with React, Three.js, and Supabase.

## Project Structure

```
src/
  ├── components/        # Shared UI components
  ├── features/         # Feature-based modules
  │   ├── auth/        # Authentication feature
  │   ├── game/        # Game feature
  │   └── quantum/     # Quantum mechanics feature
  ├── lib/             # Shared libraries and utilities
  │   └── supabase/    # Supabase client and API
  ├── styles/          # Global styles
  └── types/           # Shared TypeScript types
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

## Features

- Real-time multiplayer gameplay
- Quantum mechanics-inspired mechanics
- Beautiful 3D graphics with Three.js
- Secure authentication with Supabase