import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NpcService {
  constructor() {}

  /**
   * Create a no-moving, the npc will play animation1 in 2s loop and
   * animation2 every 10s if it exist.
   *
   * @param scene - Scene where the NPC will be
   * @param scaleOfTheGame - Scale of the scene
   * @param initialNpcX - Position x of the NPC
   * @param initialNpcY - Position y of the NPC
   * @param textureKey - Texture key for the NPC
   *
   * @returns The NPC sprite
   */
  createNpc(
    scene: Phaser.Scene,
    scaleOfTheGame: number,
    initialNpcX: number,
    initialNpcY: number,
    textureKey: string
  ) {
    const npc = scene.add.sprite(
      initialNpcX,
      initialNpcY,
      textureKey,
      'npcAnimation1/frame0001'
    );
    npc.setScale(scaleOfTheGame);

    scene.anims.create({
      key: 'npcAnimation1',
      frames: scene.anims.generateFrameNames(textureKey, {
        start: 1,
        end: 2,
        prefix: 'npcAnimation1/frame000',
        suffix: '',
        zeroPad: 1,
      }),
      frameRate: 0.5,
      repeat: -1, // loop indefinitely
    });

    if (!scene.anims.exists('npcAnimation2')) {
      scene.anims.create({
        key: 'npcAnimation2',
        frames: scene.anims.generateFrameNames(textureKey, {
          start: 1,
          end: 2,
          prefix: 'npcAnimation2/frame000',
          suffix: '',
          zeroPad: 1,
        }),
        frameRate: 1, // 1 frame per second
        repeat: 0, // play once
      });
    }

    // Start the standing animation
    npc.play('npcAnimation1');
    if (scene.anims.exists('npcAnimation2')) {
      scene.time.addEvent({
        delay: 10000, // 10 seconds
        callback: () => {
          npc.play('npcAnimation2', true);
          npc.once('animationcomplete', () => {
            npc.play('npcAnimation1', true);
          });
        },
        loop: true,
      });
    }

    return npc;
  }
}
