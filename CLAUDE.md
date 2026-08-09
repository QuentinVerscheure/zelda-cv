# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Zelda-CV is a personal resume/portfolio site styled as a playable Game Boy "Link's Awakening" game. A player walks around a world map and enters "houses" to view CV content, portfolio, contact form, guestbook, etc. It has a real-time multiplayer layer (WebSocket) showing other visitors moving on the map, and a JWT-authenticated guestbook.

The repo is split into two independently-run projects:
- `front/` — Angular 21 app that embeds a Phaser 3 game
- `back/` — Spring Boot 3.3 REST + WebSocket API
- 

## Commands

### Frontend (`front/`)
Run all commands from inside `front/`.
- `npm start` / `ng serve` — dev server at http://localhost:4200 (talks to backend at `http://localhost:8080/api`, see `src/environments/environment.ts`)
- `ng build` — production build into `dist/` (only needed if you changed code outside `assets/`, since dev server serves `assets/` directly)
- `ng build --configuration=production` — the build used for deployment
- `ng test` — Karma/Jasmine unit tests (there are currently no `*.spec.ts` files in the repo)

### Backend (`back/`)
Run all commands from inside `back/`.
- `./mvnw spring-boot:run` — dev server at http://localhost:8080
- `./mvnw test` — run the test suite (`mvn test` if you have Maven installed globally)
- `./mvnw clean package -DskipTests` — build the deployable jar (`target/Zelda-cv-1.0.0.jar`)
- `java -jar target/Zelda-cv-1.0.0.jar --spring.profiles.active=prod` — run with the `prod` profile (`application-prod.properties`, gitignored, holds real DB/JWT/CORS secrets)
- Swagger UI: http://localhost:8080/swagger-ui/index.html — create a user via `POST /api/users`, log in via `POST /api/auth/login`, paste the returned token into the "Authorize" button.

The backend needs a MySQL database (`spring.datasource.url` in `application.properties`) matching the schema in `back/src/main/resources/static/shemaDB.png`.

## Architecture

### Frontend: Angular hosting a Phaser game, scenes as Angular services

The Angular app is mostly a thin shell (`AppComponent`: router outlet + `MenuComponent` + `ContactFormComponent` + `CommentFormComponent`) around a single `CoreComponent` (`front/src/app/game/core/core.component.ts`) that owns the `Phaser.Game` instance.

Key architectural pattern: **every Phaser Scene is an `@Injectable` Angular service that extends `Phaser.Scene`** (e.g. `SceneWorldService`, `SceneCVService`, `SceneContactService`, one per "house" under `front/src/app/game/scenes/<house>/`). This lets scenes use Angular DI to pull in shared core services instead of Phaser's own scene-data plumbing. `CoreComponent` injects all scene services and registers them in the `Phaser.Types.Core.GameConfig.scene` array when it builds the game.

Shared game logic lives in `front/src/app/game/core/`:
- `movement.service.ts`, `collision.service.ts`, `player.service.ts`, `npc.service.ts`, `scale-of-the-game.service.ts` — reusable per-scene behavior (movement/collision/player sprite/NPCs are the same across every house scene)
- `change-scene.service.ts` — bridges Angular routing and Phaser scene switching. Angular routes are `game/:scene` (see `app-routing.module.ts`); this service maps the URL segment (`cv`, `portfolio`, `contact`, ...) to a Phaser scene key, stops all running scenes, and starts the target one on every `NavigationEnd`. Transitions triggered *inside* the game (walking into a house's collision box) go through `changeSceneFromCollisionBox()` instead, carrying landing coordinates directly — the URL is not used for that path because it needs positional data.
- `houses-data.service.ts` — preloads all YAML content (`assets/texts/*.yaml`) once at game start (in `CoreComponent.ngOnInit`) before scenes' `preload()`/`create()` run, to avoid async-loading races with Phaser's lifecycle.

Content is data-driven via YAML files in `front/src/assets/texts/` (`cv_data.yaml`, `link_data.yaml`, `portfolio_data.yaml`, `various_data.yaml`) plus `front/src/assets/config.json` for menu name/CV filename/contact email/debug mode. NPC dialogue text lives in per-NPC JSON files under `front/src/assets/game/`. This is the intended customization surface documented in `README.md` for anyone forking the project for their own resume.

Multiplayer: `websocket-player.service.ts` sends the local player's position/scene over a WebSocket and `player-sync.service.ts` renders the other players' sprites received from the backend broadcast.

Map/scene assets (tilesets, collision maps, atlases) are authored externally with Tiled and GIMP — see the "To create or edit a scene with Tiled" section of `README.md`. Editable source files (`.tiled-project`, `.tiled-session`, `.xcf`, `.tmx`) live in `front/divers/`; exported JSON/PNG game assets used at runtime live in `front/src/assets/game/`.

### Backend: layered Spring Boot app

Standard `controller → service (+ Impl) → repository → model` layering per domain under `back/src/main/java/zeldaCV/`: `user`, `comment` (guestbook), `achievement`, plus a `mailControler` for the contact form. DTOs and mapping live in `dto/` and `converter/` (mappers), not in the entities.

- Auth: JWT-based (`security/jwt/`: `JwtAuthenticationFilter`, `JwtTokenProvider`), configured in `security/SecurityConfig.java`. Endpoint authorization is declared per-route there (GET comments/achievements/users and login/registration are public; POST/PUT/DELETE comments, and everything else under `/api/**`, require auth). CORS origin is driven by `app.cors.allowed-origin` (wildcard in dev, locked to the production domain in the `prod` profile).
- WebSocket multiplayer: `websocket/PlayerPositionWebSocketHandler` keeps an in-memory `ConcurrentHashMap` of the latest position per session, and on a fixed 200ms `@Scheduled` tick broadcasts up to ~50 other players in the *same scene* back to each connected client (`TopPlayersDTO`). State is in-memory only — restarting the backend clears all live positions (fine, since it's just visual presence, not persisted data).
- Achievements: unlocked client-side and synced via `AchievementController`/`AchievementService`, keyed by constants in `constants/AchievementConstants.java`.
- Mail: contact form submissions go through `MailService`/`JavaMailSenderConfig` (SMTP settings via env vars, see `application.properties`).

### Configuration/secrets

`back/src/main/resources/application-prod.properties` (gitignored) holds real DB credentials, JWT secret, and the production CORS origin — never commit real values here; `application.properties` in the repo only has local/dev placeholders. Frontend API base URL is set per-build via `front/src/environments/environment*.ts`.

### Known/accepted issue

Per `README.md`: two moderate `npm audit` vulnerabilities in a transitive dependency (`i18next-http-backend` via `phaser3-rex-plugins`) are intentionally left unfixed to avoid a breaking `npm audit fix --force`, pending a compatible `phaser3-rex-plugins` release.