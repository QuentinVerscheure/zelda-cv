import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';

@Injectable({
  providedIn: 'root',
})
export class SceneContactService extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = 4;

  constructor(
    private movementService: MovementService,
    private collisionService: CollisionService,
    private playerService: PlayerService
  ) {
    super({ key: 'sceneContact' });
  }

  preload() {
    this.load.image(
      'phoneHouse_background',
      'assets/game/Phone_House_Background.png'
    );

    this.load.html('contactForm', 'assets/html/contact-form.html');

    //load the collision between the background and the player
    this.load.json(
      'phoneHouseCollisionBackgroundData',
      'assets/game/phone_house_collision_background.json'
    );

    //load an invisible sprite for the hitbox detection for the change of scene
    this.load.image('sceneTransitionSprite', 'assets/game/hitbox.png');

    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );
  }

  create() {
    this.background = this.add.image(0, 0, 'phoneHouse_background');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    const initialPlayerX = 97 * this.scaleOfTheGame; // Set your desired initial X position
    const initialPlayerY = 232 * this.scaleOfTheGame; // Set your desired initial Y position

    this.player = this.playerService.createPlayer(
      this.player,
      this,
      this.scaleOfTheGame,
      initialPlayerX,
      initialPlayerY,
      'walkingTop/frame0001'
    );

    this.collisionService.createWorldCollisions(
      this,
      this.scaleOfTheGame,
      this.player,
      'phoneHouseCollisionBackgroundData'
    );

    if (this.input.keyboard) {
      this.movementService.initializeKeyboardInput(this.input);
    }

    this.collisionService.createSceneTransitionCollision(
      this,
      this.scaleOfTheGame,
      this.player,
      'sceneTransitionSprite',
      'sceneWorld',
      88,
      246,
      410,
      1490
    );

    const formHtml = `
    <div class="login" id="contactForm">
      <form>
        <input type="email" placeholder="votre email" id="email" name="email" />
        <input type="text" placeholder="Objet du mail" id="object" name="object" />
        <textarea placeholder="Objet du mail" id="bodyOfMail" name="bodyOfMail" cols="40" rows="5"></textarea>
        <input type="submit" value="send" name="Envoyer" />
      </form>
    </div>
  `;

    const contactForm = this.add.dom(100, 100, 'div', formHtml);
console.log(contactForm);
contactForm.setScale(1).setOrigin(0.5, 0.5); // Adjust scaling and origin

    contactForm.addListener('click');

    contactForm.on('click', function (event: { target: { name: string } }) {
      if (event.target.name === 'loginButton') {
        const inputEmail = contactForm.getChildByName('email') as HTMLInputElement;
        const inputObject = contactForm.getChildByName('object') as HTMLInputElement;
        const inputBodyOfMail = contactForm.getChildByName('bodyOfMail') as HTMLTextAreaElement;

        //  Have they entered anything?
        if (
          inputEmail != null &&
          inputObject != null &&
          inputBodyOfMail != null &&
          inputEmail.value !== '' &&
          inputObject.value !== '' &&
          inputBodyOfMail.value !== ''
        ) {
          //  Turn off the click events
          contactForm.removeListener('click');

        } else {
        }
      }
    });
  }

  override update() {
    this.movementService.movePlayer(this.player, this.scaleOfTheGame);
  }
}
