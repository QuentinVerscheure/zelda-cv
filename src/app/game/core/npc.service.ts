import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NpcService {
  constructor() {}

  createNpc(
    scene: Phaser.Scene,
    scaleOfTheGame: number,
    initialNpcX: number,
    initialNpcY: number,
  ) {
    const npc = scene.physics.add.sprite(
      initialNpcX,
      initialNpcY,
      'LinkHouseNpc', // Texture key for the NPC
      'standing/frame0001' // Initial frame
    );
    npc.setScale(scaleOfTheGame);

    scene.anims.create({
      key: 'npc_standing',
      frames: scene.anims.generateFrameNames('LinkHouseNpc', {
        start: 1,
        end: 2,
        prefix: 'standing/frame000',
        suffix: '',
      }),
      frameRate: 0.5, // 1 frame per second
      repeat: -1, // loop indefinitely
    });

    scene.anims.create({
      key: 'npc_angry',
      frames: scene.anims.generateFrameNames('LinkHouseNpc', {
        start: 1,
        end: 2,
        prefix: 'angry/frame000',
        suffix: '',
      }),
      frameRate: 1, // 1 frame per second
      repeat: 0, // play once
    });

    // Start the standing animation
    npc.play('npc_standing');

    scene.time.addEvent({
      delay: 10000, // 10 seconds
      callback: () => {
        npc.play('npc_angry', true);
        npc.once('animationcomplete', () => {
          npc.play('npc_standing', true);
        });
      },
      loop: true,
    });

    return npc;
  }
}