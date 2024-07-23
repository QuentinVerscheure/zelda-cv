/**
 * Represents the properties needed for create the scene transition
 */
export type SceneTransitionCollisionData = [
  string, // name of the sprite collision
  string, // sceneToLoad
  number, // X Position of hitbox
  number,  // Y Position of hitbox
  number?, // start X position in new scene
  number?  // start Y position in new scene
];
