import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';
import { ValidAchievementService } from '../../core/valid-achievement.service';
import { ScaleOfTheGameService } from '../../core/scale-of-the-game.service';

@Injectable({
  providedIn: 'root',
})
export class SceneCreditService extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = ScaleOfTheGameService.getScaleOfTheGame();

  constructor(
    private collisionService: CollisionService,
    private playerService: PlayerService,
    private validAchievementService: ValidAchievementService
  ) {
    super({ key: 'sceneCredit' });
  }

  preload() {
    this.validAchievementService.ValidAchievement('cvHouse');

    this.load.image('creditBackground', 'assets/game/credit_background.png');

    //load the collision between the background and the player
    this.load.json(
      'creditCollisionBackgroundData',
      'assets/game/credit_collision_background.json'
    );

    this.load.image('NintendoLogo', 'assets/logo/Nintendo-Logo.png');
    this.load.image('zeldaOracleOfAge', 'assets/logo/zelda-oracle-of-age.png');
    this.load.image(
      'zeldaOracleOfSeasons',
      'assets/logo/zelda-oracle-of-seasons.png'
    );
    this.load.image('linkAwakening', 'assets/logo/link-awakening.jpg');
    this.load.image('GitHubLogo', 'assets/logo/GitHub-Logo.png');

    //load an invisible sprite for the hitbox detection for the change of scene
    this.load.image('sceneTransitionSprite', 'assets/game/hitbox.png');

    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );
  }

  create() {
    this.background = this.add.image(0, 0, 'creditBackground');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    const initialPlayerX = 160 * this.scaleOfTheGame; // Set your desired initial X position
    const initialPlayerY = 235 * this.scaleOfTheGame; // Set your desired initial Y position

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
      'creditCollisionBackgroundData'
    );

    MovementService.initializeInput(this);

    this.collisionService.createSceneTransitionCollision(
      this,
      this.scaleOfTheGame,
      this.player,
      'sceneTransitionSprite',
      'sceneWorld',
      152,
      250,
      442,
      1110
    );

    //-------------------------------- nintendo credit --------------------------------------
    const NintendoLogo = this.add.image(
      25 * this.scaleOfTheGame,
      25 * this.scaleOfTheGame,
      'NintendoLogo'
    );
    NintendoLogo.setOrigin(0, 0); // Positionner par le bord gauche
    NintendoLogo.displayHeight = 12.5 * this.scaleOfTheGame; // Taille fixe en longueur
    NintendoLogo.scaleX = NintendoLogo.scaleY; // Laisser libre en largeur

    const linkAwakening = this.add.image(
      30 * this.scaleOfTheGame,
      65 * this.scaleOfTheGame,
      'linkAwakening'
    );
    linkAwakening.setOrigin(0, 0); // Positionner par le bord gauche
    linkAwakening.displayHeight = 25 * this.scaleOfTheGame; // Taille fixe en longueur
    linkAwakening.scaleX = linkAwakening.scaleY; // Laisser libre en largeur

    const zeldaOracleOfAge = this.add.image(
      30 * this.scaleOfTheGame,
      120 * this.scaleOfTheGame,
      'zeldaOracleOfAge'
    );
    zeldaOracleOfAge.setOrigin(0, 0); // Positionner par le bord gauche
    zeldaOracleOfAge.displayHeight = 25 * this.scaleOfTheGame; // Taille fixe en longueur
    zeldaOracleOfAge.scaleX = zeldaOracleOfAge.scaleY; // Laisser libre en largeur

    const zeldaOracleOfSeasons = this.add.image(
      75 * this.scaleOfTheGame,
      120 * this.scaleOfTheGame,
      'zeldaOracleOfSeasons'
    );
    zeldaOracleOfSeasons.setOrigin(0, 0); // Positionner par le bord gauche
    zeldaOracleOfSeasons.displayHeight = 25 * this.scaleOfTheGame; // Taille fixe en longueur
    zeldaOracleOfSeasons.scaleX = zeldaOracleOfSeasons.scaleY; // Laisser libre en largeur

    this.createText(
      27.5,
      45,
      'The assets used on this site are the legal property of Nintendo. All rights reserved by Nintendo.'
    );
    this.createText(
      27.5,
      96.25,
      'they come from the game "the legend of zelda link\'s awakening", "the legend of zelda oracle of age" and "the legend of zelda oracle of seasons"'
    );

    //-------------------------------- author credit --------------------------------------

    this.createText(
      130,
      45,
      'Code Author: Quentin Verscheure, 2024',
      'https://github.com/QuentinVerscheure/zelda-cv'
    );

    const pictureSprite = this.add.image(
      this.scaleOfTheGame * 160,
      this.scaleOfTheGame * 70,
      'GitHubLogo'
    );
    pictureSprite.setScale(0.08 * this.scaleOfTheGame);

    pictureSprite.setInteractive({ useHandCursor: true });

    pictureSprite.on('pointerdown', () => {
      this.validAchievementService.ValidAchievement('linkCklicked');
      window.open('https://github.com/QuentinVerscheure/zelda-cv', '_blank');
    });

    //-------------------------------- ripped credit --------------------------------------

    this.createText(220, 30, 'Thanks to the author of the ripped assets');

    let x = 220;
    let y = 45;
    let rippedCredits = [
      {
        name: 'MisterMike - "Level 7 - Eagle Tower"',
        url: 'https://www.spriters-resource.com/game_boy_gbc/thelegendofzeldalinksawakeningdx/sheet/139224/',
      },
      {
        name: 'MisterMike - "Level 2 - Bottle Grotto"',
        url: 'https://www.spriters-resource.com/game_boy_gbc/thelegendofzeldalinksawakeningdx/sheet/139219/',
      },
      {
        name: 'MisterMike - "Level 3 - Key Cavern',
        url: 'https://www.spriters-resource.com/game_boy_gbc/thelegendofzeldalinksawakeningdx/sheet/139220/',
      },
      {
        name: 'BigGoron - "Mask Shop"',
        url: 'https://www.spriters-resource.com/game_boy_gbc/thelegendofzeldaoracleofages/sheet/22697/',
      },
      {
        name: 'Shawn - "Mayor\'s House"',
        url: 'https://www.spriters-resource.com/game_boy_gbc/thelegendofzeldaoracleofseasons/sheet/8966/',
      },
      {
        name: 'RedJoe - "Dr. Troy\'s Hut"',
        url: 'https://www.spriters-resource.com/game_boy_gbc/thelegendofzeldaoracleofages/sheet/8939/',
      },
      {
        name: 'Ryan914 - "Eyeglass Isle Library"',
        url: 'https://www.spriters-resource.com/game_boy_gbc/thelegendofzeldaoracleofages/sheet/55375/',
      },
      {
        name: 'axmarrone - "Horon Village Houses"',
        url: 'https://www.spriters-resource.com/game_boy_gbc/thelegendofzeldaoracleofseasons/sheet/25013/',
      },
      {
        name: 'Red Mage Moogle - "House Tiles"',
        url: 'https://www.spriters-resource.com/game_boy_gbc/thelegendofzeldaoracleofseasons/sheet/9114/',
      },
      {
        name: 'RedJoe - "Post Office"',
        url: 'https://www.spriters-resource.com/game_boy_gbc/thelegendofzeldaoracleofages/sheet/9065/',
      },
      {
        name: 'RedJoe - "Plen\'s House"',
        url: 'https://www.spriters-resource.com/game_boy_gbc/thelegendofzeldaoracleofages/sheet/9062/',
      },
      {
        name: 'FrenchOrange - "Pewter City Museum"',
        url: 'https://www.spriters-resource.com/game_boy_gbc/pokemonyellow/sheet/160760/',
      },
      {
        name: 'FrenchOrange - "Center/Mart"',
        url: 'https://www.spriters-resource.com/game_boy_gbc/pokemoncrystal/sheet/9227/',
      },
      {
        name: 'FungiCaptain - "Dark Link ..."',
        url: 'https://www.spriters-resource.com/browser_games/supermariobroscrossover/sheet/176490/',
      },
      {
        name: 'FungiCaptain - "Link - Link\'s Awakening',
        url: 'https://www.spriters-resource.com/browser_games/supermariobroscrossover/sheet/176489/',
      },
      {
        name: 'TheAlmightyGuru - "Map - Koholint"',
        url: 'http://www.thealmightyguru.com/Wiki/index.php?title=File:Legend_of_Zelda,_The_-_Link%27s_Awakening_DX_-_GBC_-_Map_-_Koholint.png',
      },
      {
        name: 'Mad Scrub - "gravure du poisson rêve"',
        url: 'https://zelda.fandom.com/fr/wiki/Poisson-R%C3%AAve?file=Gravure_du_R%C3%AAve2.jpg',
      },
      {
        name: 'The IT - "NPCs Ages"',
        url: 'assets/game/NPCs Ages.png',
      },
      {
        name: 'The IT - "NPCs Seasons"',
        url: 'assets/game/NPCs Seasons.png',
      },
      {
        name: 'Tailss85 and Shawn - "Beginning Area"',
        url: 'assets/game/BeginningArea.gif',
      },
    ];

    for (let index = 0; index < rippedCredits.length; index++) {
      this.createText(
        x,
        y,
        rippedCredits[index].name,
        rippedCredits[index].url
      );
      y = y + 6;
    }
  }

  override update() {
    MovementService.movePlayer(this.player, this.scaleOfTheGame);
  }

  private textStyle = {
    fontFamily: 'Pixelify_Sans',
    fontSize: 4 * this.scaleOfTheGame,
    color: '#000000',
    wordWrap: { width: 75 * this.scaleOfTheGame, useAdvancedWrap: true },
  };

  createText(x: number, y: number, text: string, url?: string) {
    // Create a temporary text object to measure its dimensions
    const tempTextObject = this.add.text(0, 0, text, this.textStyle);
    const textWidth = tempTextObject.width;
    const textHeight = tempTextObject.height;
    tempTextObject.destroy(); // Destroy the temporary text object after measuring

    // Create a background rectangle with a very light gray color
    const background = this.add.graphics();
    background.fillStyle(0xededed, 1); // Very light gray color with full opacity
    const backgroundRect = new Phaser.Geom.Rectangle(
      (x - 1.25) * this.scaleOfTheGame,
      (y - 1.25) * this.scaleOfTheGame,
      textWidth + 2.5 * this.scaleOfTheGame,
      textHeight + 2.5 * this.scaleOfTheGame
    );
    background.fillRectShape(backgroundRect);

    if (url) {
      // Make the background interactive and add click event
      background.setInteractive(backgroundRect, Phaser.Geom.Rectangle.Contains);
      background.on('pointerdown', () => {
        window.open(url, '_blank'); // Open the URL in a new tab
      });

      background.on('pointerover', () => {
        this.game.canvas.style.cursor = 'pointer';
      });
      background.on('pointerout', () => {
        this.game.canvas.style.cursor = 'default';
      });
    }

    // Add the text on top of the background rectangle
    const textObject = this.add.text(
      x * this.scaleOfTheGame,
      y * this.scaleOfTheGame,
      text,
      this.textStyle
    );
    // Ensure text is above the background
    textObject.setDepth(1);
  }
}
