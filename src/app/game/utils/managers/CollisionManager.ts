import Phaser from 'phaser';
import { Player } from '../../models/player/player';

/**
 * Callback handlers for collision events between game objects.
 */
type CollisionCallbacks = {
  onPlayerHit: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback;
  onPlayerBulletHitsEnemy: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback;
};

/**
 * Manages collision setup and handlers between game objects.
 */
export class CollisionManager {
    private scene: Phaser.Scene;

    constructor(
        scene: Phaser.Scene,
        player: Player,
        enemies: Phaser.Physics.Arcade.Group,
        enemyBullets: Phaser.Physics.Arcade.Group,
        bullets: Phaser.Physics.Arcade.Group,
        callbacks: CollisionCallbacks
    ) {
        this.scene = scene;

        scene.physics.add.overlap(player, enemyBullets, callbacks.onPlayerHit, undefined, scene);
        scene.physics.add.overlap(player, enemies, callbacks.onPlayerHit, undefined, scene);
        scene.physics.add.overlap(bullets, enemies, callbacks.onPlayerBulletHitsEnemy, undefined, scene);
    }
}
