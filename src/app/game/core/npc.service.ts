import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NpcService {
  constructor() {}

  /**
   *  create a static npc with 1 or 2 animation and optionnale dialogue text
   *
   * @param scene - The current scene
   * @param scaleOfTheGame - scale of the game
   * @param initialNpcX - x of the npc
   * @param initialNpcY - y of the npc
   * @param textureKey - the name of the npc
   * @param player - the player object for collisions
   * @param secondAnimation - does the npc have a 2nd animation?
   * @param animationTimer - duration of the animation  (1 = 1 frame per second)
   * @param jsonNameForNpcText? - if npc have text, name of the json for the text
   */
  public createNpc(
    scene: Phaser.Scene,
    scaleOfTheGame: number,
    initialNpcX: number,
    initialNpcY: number,
    textureKey: string,
    player: Phaser.Physics.Arcade.Sprite,
    secondAnimation: boolean,
    animationTimer: number,
    jsonNameForNpcText?: string
  ) {
    if (jsonNameForNpcText) {
      scene.load.json(
        jsonNameForNpcText,
        'assets/game/' + jsonNameForNpcText + '.json'
      );
    }

    scene.load.once('complete', () => {
      this.createNpcSprite(
        scene,
        scaleOfTheGame,
        initialNpcX,
        initialNpcY,
        textureKey,
        player,
        secondAnimation,
        animationTimer,
        jsonNameForNpcText
      );
    });

    scene.load.start();
  }

  /**
   * create the npc sprite
   */
  private createNpcSprite(
    scene: Phaser.Scene,
    scaleOfTheGame: number,
    initialNpcX: number,
    initialNpcY: number,
    textureKey: string,
    player: Phaser.Physics.Arcade.Sprite,
    secondAnimation: boolean,
    animationTimer: number,
    jsonNameForNpcText?: string
  ) {
    const npc = scene.physics.add.sprite(
      initialNpcX * scaleOfTheGame,
      initialNpcY * scaleOfTheGame,
      textureKey,
      'npcAnimation1/frame0001'
    );
    npc.setScale(scaleOfTheGame);
    npc.body.immovable = true;
    scene.physics.add.collider(player, npc);

    const animationKey1: string = textureKey + '1';
    scene.anims.create({
      key: animationKey1,
      frames: scene.anims.generateFrameNames(textureKey, {
        start: 1,
        end: 2,
        prefix: 'npcAnimation1/frame000',
        suffix: '',
        zeroPad: 1,
      }),
      frameRate: animationTimer,
      repeat: -1, // loop indefinitely
    });

    const animationKey2: string = textureKey + '2';
    if (secondAnimation) {
      scene.anims.create({
        key: animationKey2,
        frames: scene.anims.generateFrameNames(textureKey, {
          start: 1,
          end: 2,
          prefix: 'npcAnimation2/frame000',
          suffix: '',
          zeroPad: 1,
        }),
        frameRate: 1, // 1 frame/second
        repeat: 0, // play once
      });

      //set event to play animation2 every 10s
      scene.time.addEvent({
        delay: 10000, // 10 seconds
        callback: () => {
          npc.play(animationKey2, true);
          npc.once('animationcomplete', () => {
            npc.play(animationKey1, true);
          });
        },
        loop: true,
      });
    }

    npc.play(animationKey1);

    // if the npc have text, create it
    if (jsonNameForNpcText) {
      this.createText(
        jsonNameForNpcText,
        scene,
        scaleOfTheGame,
        initialNpcX,
        initialNpcY
      );
    }
  }

  /**
   *  create and display the dialogue text for the npc
   * @param jsonNameForNpcText - the name of the json file containing the text for the npc
   * @param initialNpcX - Coordinate the text in the scene, using the same position as the NPC
   *
   */
  private createText(
    jsonNameForNpcText: string,
    scene: Phaser.Scene,
    scaleOfTheGame: number,
    initialNpcX: number,
    initialNpcY: number
  ) {
    const texts = scene.cache.json.get(jsonNameForNpcText);
    if (!texts) {
      console.error('JSON data is null or undefined');
      return;
    }

    const textBubble = scene.add.text(
      initialNpcX * scaleOfTheGame, //center of text will be align with center of npc
      (initialNpcY - 15) * scaleOfTheGame, //text will be 15px above the npc
      '',
      {
        fontFamily: 'Pixelify_Sans',
        fontSize: '16px',
        color: '#000000',
        backgroundColor: '#ded4d4',
        padding: { x: 10, y: 5 },
        align: 'center',
        wordWrap: { width: 200 },
      }
    );

    textBubble.setOrigin(0.5, 1);

    let index = 0;
    const showNextText = () => {
      //create a loop to display all text with a looping of 4s and a blanc of 6s at the end
      textBubble.setText(texts[index]);
      textBubble.setPadding({ x: 10, y: 5 });
      index = (index + 1) % texts.length;

      scene.time.addEvent({
        delay: 4000,
        callback: () => {
          if (index === 0) {
            textBubble.setText('');
            textBubble.setPadding({ x: 0, y: 0 });
            scene.time.addEvent({
              delay: 6000,
              callback: showNextText,
            });
          } else {
            showNextText();
          }
        },
      });
    };

    showNextText();
  }
}
