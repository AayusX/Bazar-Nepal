# Bazaar Nepal — Mobile Marketplace

> The **Bazaar Nepal** mobile app — a shared marketplace for buying and selling
> goods across Nepal. Browse, save, chat, and sell everything from phones to
> furniture, all in one app.

| | |
|---|---|
| **Marketing site** | <https://github.com/AayusX/bazar-nepal-website> |
| **REST API** | <https://github.com/AayusX/Bazar-Api> |
| **Hosted API** | `https://server-production-b669.up.railway.app` |
| **Android release** | Download from the Releases tab |

---

## Features

- 📱 **Full marketplace flow** — browse products, search, filter by category
- 🔐 **Accounts** — register, login, seller profiles with JWT auth
- 📝 **Sell in seconds** — publish products with up to 5 photos and price history
- 💬 **In-app chat** — buyer ↔ seller conversations in real time
- 🔔 **Notifications** — new listings, messages, and view milestones
- ❤️ **Saved items** — bookmark products to buy later
- 🖥️ **Reports & moderation** — report suspicious listings
- 📡 **Realtime** — GraphQL subscriptions push updates instantly

## Tech Stack

### Mobile app — Expo / React Native

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Framework  | Expo, React Native, TypeScript                  |
| UI         | Themed component system (`src/theme`, shared UI kit) |
| Navigation | React Navigation (`src/navigation`)             |
| Data       | GraphQL client (`src/api`, `src/services`)      |
| Push       | Firebase Cloud Messaging                        |

Screens include Home, Search, Add Product, Product Details, Chat, Inbox,
Notifications, Saved Items, Profile, Seller Profile, Login, Register, and
Settings.

### Backend — Spring Boot GraphQL API (`backend/`)

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Framework  | Java, Spring Boot, Spring Security              |
| API        | GraphQL schema (products, auth, chat, notifications, reports) |
| Data       | JPA repositories + Flyway migrations (`V1`–`V4`) |
| Realtime   | GraphQL subscriptions via WebSocket             |
| Auth       | JWT filter + login rate limiter                 |
| Deploy     | Docker + Railway (`railway.json`)               |

## Getting Started

### Backend

```bash
cd backend
./mvnw spring-boot:run
# GraphQL endpoint + schema at src/main/resources/graphql/schema.graphqls
```

### Mobile app

```bash
npm install
npx expo start
# Scan the QR code with Expo Go, or press 'a' for Android emulator
```

> Point the API client to your backend or the hosted Railway URL via
> `src/api/config.ts` / `app.json`.

## Project Structure

```
├── src/
│   ├── api/               # GraphQL client, types, operations
│   ├── components/        # Shared UI kit (Button, Card, ChatPopup…)
│   ├── constants/         # Mock data
│   ├── context/           # App-wide state
│   ├── navigation/        # Navigation tree
│   ├── screens/           # 14 app screens
│   ├── services/          # API + notification service
│   └── theme/             # Colors, typography, spacing, shadows
├── backend/               # Spring Boot GraphQL server
│   ├── src/main/java/com/bazaarnepal/   # domain, graphql, security, service
│   └── src/main/resources/             # schema.graphqls + Flyway migrations
├── assets/                # App icons & splash
└── app.json, eas.json     # Expo config
```

## License

MIT — see [LICENSE](LICENSE).