# ZeldaCv
You can visit the website at: [quentinverscheure.fr](https://quentinverscheure.fr)

## Credit

This application is a resume using the theme of the game "Link's Awakening" from the Zelda franchise.  
It has been designed to be customizable by any user.  
Unfortunately, I don't have permission from Nintendo to use their assets for my work.  
Please, Nintendo, don't take legal action against me. This project doesn't generate any revenue, and I'm just a poor, lonesome developer.  
If you want to contact me: quentin.verscheure@gmail.com

a websocket multiplayer system allow you to see other users in real time in the map

you can create a comment in the guestbook house by clicking on the book, create your comment and drag and drop it on some free space 

## Customization

### To customize this project for your personal use, you must modify:

#### front: In  `front/src/assets/texts`:
- `cv_data.yaml`: your resume  
  This is the main content of your CV.
- `link_data.yaml`: some links  
  Includes links like your Facebook, LinkedIn, or CodePen.
- `portfolio_data.yaml`: your portfolio  
  The projects you've created and the pictures to showcase.
- `various_data.yaml`: some various information about you  
  Includes small information like mobility, secondary languages, or hobbies.

#### front: In `front/src/assets/docs`:
- Replace the file `CV.pdf` with your own resume.

#### front: In `front/src/assets/config.json`:
- `"debugMode"`: used to activate debug mode (visibility of hitboxes and mobility of the player).
- `"me"`:
  - `"menuName"`: The name displayed as the title in the menu.
  - `"cvName"`: The name given to your `CV.pdf` when downloaded.
  - `"mail"`: Your email displayed in the ContactHouse.

#### front: In `front/src/environments`:
- `environment.ts` / `environment.prod.ts`: set `apiUrl` to the URL where your own backend is reachable (defaults to `http://localhost:8080/api` in dev and `https://quentinverscheure.fr/api` in the production build).

#### back: In `back/src/main/resources/application.properties`:
- `spring.datasource.url` / `username` / `password`: point to your own MySQL database (create an empty schema first, Hibernate will create the tables on first run via `spring.jpa.hibernate.ddl-auto=update`).
- `jwt.secret`: replace with your own secret used to sign JWT tokens.
- Mail settings (`spring.mail.*`) can be provided via the `MAIL_HOST` / `MAIL_PORT` / `MAIL_USER` / `MAIL_PASS` environment variables, but note that `JavaMailSenderConfig` currently overrides them with a hardcoded local test config (see below) — mail sending isn't fully wired up yet, on either the front or the back.

#### back: In `JavaMailSenderConfig`:
- your mailsender properties
#### back: In `MailService`:
- your email adresse


### To modify the words of an NPC:
#### In `front/src/assets/game`:
- Modify the `<npc_name>_text.json` file of your NPC (e.g. `fairy_text.json`).  
  Each line is shown for 4 seconds; once every line has been shown, there is a 6 second blank pause before the loop restarts from the first line.

## Development

### front:

#### To create or edit a scene with Tiled:

- Create your PNG image.
- Install and open Tiled.
- Create a **New Map**. Set the **Tile Size** to 16x16 (optional), and set your image dimensions.
- On the right, in the **Layers** panel, right-click and select **Add Tile Layer** (for tilemaps) or **Add Image Layer** (for background images).
  - In the **Properties** panel on the left, set the image for the layer if using an Image Layer.
- On the right, in the **Layers** panel, right-click and select **Add Object Layer** (for hitboxes or interactive objects).
  - Ctrl + right-click to snap objects to the 16x16 grid (optional), and create your hitboxes using the **Insert Rectangle** tool.
- Go to **File > Export As...** and choose **JSON** format.

#### stack & usage

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) and currently runs on Angular 21.  
It uses the [Phaser](https://phaser.io/) library to create the game.  

Run `ng serve` for a development server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.  
Run `ng build` to generate the deployment files only if you modify code that isn't in the `assets` folder. The build artifacts will be stored in the `dist/` directory.

### back:

#### stack & usage

- Apache Maven 3.9.9
- Java version: 17.0.12, vendor: Oracle Corporation
- Spring Boot 3.3.3 with dependencies:
  - Spring Web
  - Spring Data JPA
  - MySQL Driver
  - Spring DevTools
  - Spring Security (JWT auth)
  - Spring Mail
  - Springdoc OpenAPI (Swagger)
  - WebSocket (multiplayer real time)

A Maven wrapper is included, so a local Maven install isn't required: use `./mvnw` (or `mvnw.cmd` on Windows) instead of `mvn` below.

Run `mvn spring-boot:run` for a development server.  
Run `mvn clean package -DskipTests` to build the jar, then `java -jar target/Zelda-cv-1.0.0.jar --spring.profiles.active=prod` to run it with the production profile (`application-prod.properties`, not committed to the repo — create it yourself next to `application.properties`).

#### swagger

Swagger available at: http://localhost:8080/swagger-ui/index.html  
To use it, create an account with `POST /api/users` (Create a new user), then authenticate with `POST /api/auth/login`.  
Copy/paste the token you receive in the response into the `Authorize` button in the top right.  
Remember to get a new token if you change your username or password, and note that some endpoints don't require a token at all (see `SecurityConfig`).

### DB shéma:

![Database Schema](back/src/main/resources/static/shemaDB.png)

## Git convention

When a piece of code/functionality is removed because it's no longer useful for the project (but might be worth reviving later), the removal commit is tagged `delete-functionality` instead of just deleting the code outright, so it stays easy to find and restore if needed. So far this has only been used for removing the on-screen virtual joystick and its plugin (see the `delete-functionality` tag / `delete joystick` commit).

## Security

Deux vulnérabilités modérées subsistent sur une dépendance transitive (i18next-http-backend via phaser3-rex-plugins). Elles ne sont pas corrigées afin d'éviter une mise à jour cassante (npm audit fix --force). Elles seront réévaluées lorsqu'une version compatible de phaser3-rex-plugins sera disponible.
