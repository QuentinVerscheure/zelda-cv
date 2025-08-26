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

#### front: In  `assets/texts`:
- `cv_data.yaml`: your resume  
  This is the main content of your CV.
- `link_data.yaml`: some links  
  Includes links like your Facebook, LinkedIn, or CodePen.
- `portfolio_data.yaml`: your portfolio  
  The projects you've created and the pictures to showcase.
- `various_data.yaml`: some various information about you  
  Includes small information like mobility, secondary languages, or hobbies.

#### front: In `assets/docs`:
- Replace the file `CV.pdf` with your own resume.

#### front: In `assets`:
- `config.json`: the config file
  - `"debugMode"`: used to activate debug mode (visibility of hitboxes and mobility of the player).
  - `"menuName"`: The name displayed as the title in the menu.
  - `"cvName"`: The name given to your `CV.pdf` when downloaded.
  - `"mail"`: Your email displayed in the ContactHouse.

#### back: In `JavaMailSenderConfig`:
- your mailsender properties
#### back: In `MailService`:
- your email adresse


### To modify the words of an NPC:
#### In `assets/game`:
- Modify the `"NPC_name-text.json"` of your NPC.  
  The text will loop every 6 seconds with 10 seconds of blank at the end of a loop.

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

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.0.  
It uses the [Phaser](https://phaser.io/) library to create the game.  
It uses the [VirtualJoystickPlugin](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/virtualjoystick/) for the mobile version's joystick.

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
  - Spring Security (JWT euth)
  - Springdoc OpenAPI (Swagger)
  - WebSocket (multiplayer real time)
  
Run `mvn spring-boot:run` for a development server. 
Run `java -jar your-app.jar --spring.profiles.active=prod` for a production .jar

#### swagger

Swagger available to: http://localhost:8080/swagger-ui/index.html
To use it, create a acount with `POST /api/users Create a new user` then authenticate with `POST /api/auth/login`
Copy paste the token you receive in responses in the `Authorize` button on top right
Be carefull to change the token if you modify your name or pass and don't use the token if you use a unauthenticate controler

### DB shéma:

![Database Schema](src/main/resources/static/shemaDB.png)

