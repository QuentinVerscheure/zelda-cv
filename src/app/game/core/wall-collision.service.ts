import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { BackgroundCollisionMap } from '../../models/koholint_collision_map.enum';

@Injectable({
  providedIn: 'root'
})
export class WallCollisionService {

  constructor() { }

  loadWorldCollisions(scene: Phaser.Scene, scaleOfTheGame: number, player: Phaser.Physics.Arcade.Sprite, collisionFile: string) {
    if (!scene.cache.json.has(collisionFile)) {
      console.error('Collision data is not available in the cache.');
      return;
    }

    const collisionData = scene.cache.json.get(collisionFile);
    const objects = collisionData.layers.find(
      (layer: { type: string }) => layer.type === 'objectgroup'
    )?.objects;

    if (objects) {
      objects.forEach(
        (obj: BackgroundCollisionMap) => {
          const collisionObject = scene.add.rectangle(
            obj.x * scaleOfTheGame + (obj.width * scaleOfTheGame) / 2,
            obj.y * scaleOfTheGame + (obj.height * scaleOfTheGame) / 2,
            obj.width * scaleOfTheGame,
            obj.height * scaleOfTheGame,
            0xff0000,
            0.5
          );
          scene.physics.add.existing(collisionObject);
          const collisionBody = collisionObject.body as Phaser.Physics.Arcade.Body;
          collisionBody.setImmovable(true);
          scene.physics.add.collider(player, collisionObject);
        }
      );
    }
  }
}