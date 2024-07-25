import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { BackgroundCollisionMap } from '../../models/koholint_collision_map.enum';

@Injectable({
  providedIn: 'root',
})
export class CollisionService {
  constructor() {}

  /**
   * load the background collision map
   */
  createWorldCollisions(
    scene: Phaser.Scene,
    scaleOfTheGame: number,
    player: Phaser.Physics.Arcade.Sprite,
    collisionFile: string
  ) {
    if (!scene.cache.json.has(collisionFile)) {
      console.error('Collision data is not available in the cache.');
      return;
    }

    const collisionData = scene.cache.json.get(collisionFile);
    const objects = collisionData.layers.find(
      (layer: { type: string }) => layer.type === 'objectgroup'
    )?.objects;

    if (objects) {
      objects.forEach((obj: BackgroundCollisionMap) => {
        const collisionObject = scene.add.rectangle(
          obj.x * scaleOfTheGame + (obj.width * scaleOfTheGame) / 2,
          obj.y * scaleOfTheGame + (obj.height * scaleOfTheGame) / 2,
          obj.width * scaleOfTheGame,
          obj.height * scaleOfTheGame,
          0xff0000,
          0.5
        );
        scene.physics.add.existing(collisionObject);
        const collisionBody =
          collisionObject.body as Phaser.Physics.Arcade.Body;
        collisionBody.setImmovable(true);
        scene.physics.add.collider(player, collisionObject);
      });
    }
  }

  /**
   * create the collision for trigger another scene
   */
  createSceneTransitionCollision(
    scene: Phaser.Scene,
    scaleOfTheGame: number,
    player: Phaser.Physics.Arcade.Sprite,
    nameOfTheSpriteCollision: string,
    sceneToLoad: string,
    xOfHitbox: number,
    yOfHitbox: number,
    startXPositionInNewScene?: number,
    startYPositionInNewScene?: number,
    firstAnimationFrame?: string
  ) {
    // Create hitbox for scene transition using an invisible sprite
    const exitHitbox = scene.physics.add.sprite(
      xOfHitbox * scaleOfTheGame,
      yOfHitbox * scaleOfTheGame,
      nameOfTheSpriteCollision
    );
    exitHitbox.setOrigin(0, 0); // Position by the top-left corner
    exitHitbox.displayWidth = 16 * scaleOfTheGame; // Set width
    exitHitbox.displayHeight = 16 * scaleOfTheGame; // Set height
    exitHitbox.setVisible(false); // Make the sprite invisible
    exitHitbox.body.immovable = true; // Make the hitbox immovable
    exitHitbox.body.allowGravity = false; // Disable gravity for the hitbox

    // Add collider with callback for scene transition
    scene.physics.add.collider(
      player,
      exitHitbox,
      () => {
        const landingCoordinates = { x: startXPositionInNewScene, y: startYPositionInNewScene, firstAnimationFrame: firstAnimationFrame };
        scene.scene.start(sceneToLoad, landingCoordinates);
      },
      undefined,
      scene
    );
  }
}
