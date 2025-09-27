# Todo Garden - Project Overview

## 🌱 Project Vision

Todo Garden is a unique to-do application that transforms the mundane task of completing daily todos into a delightful visual experience. Instead of traditional progress bars, users watch their productivity grow into a beautiful tree or flower.

## 🎯 Core Concept

**"Watch your productivity bloom"** - Every completed task helps your digital garden grow, creating a rewarding and motivating experience for daily productivity.

## ✨ Key Features

### 🌿 Daily Todo Management

- Create and manage daily to-do lists
- Mark tasks as complete with satisfying visual feedback
- Tree/flower growth based on completion percentage:
  - 🌱 Seed (0-20% complete)
  - 🌿 Sprout (20-40% complete)
  - 🌳 Sapling (40-60% complete)
  - 🌲 Tree (60-80% complete)
  - 🌸 Flowering Tree (80-100% complete)
- Reset your daily todos anytime
- Start fresh without losing historical data
- Easy to change the priority
- View past accomplishments
- [OPTIONAL] Celebrate your growth journey

## 🏗️ Technical Approach

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend & Data

- PostgreSQL for persistent user data and history
- User Authentication: basic auth with username/password and JWT
- NodeJS serverless application

### Deployment

- Database: Existing public accessible PostgreSQL
- Backend: Cloudflare Worker
- Frontend: Cloudflare Page
