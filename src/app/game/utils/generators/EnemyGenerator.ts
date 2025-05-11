import Phaser from 'phaser';
import { Enemy } from '../../models/enemy/enemy';

/**
 * Handles periodic spawning of enemies with random skin and speed.
 */
export class EnemyGenerator {
    private scene: Phaser.Scene;
    private enemyGroup: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene, enemyGroup: Phaser.Physics.Arcade.Group) {
        this.scene = scene;
        this.enemyGroup = enemyGroup;
    }

    /**
     * Starts spawning enemies at fixed intervals.
     * @param delay Interval in milliseconds between spawns.
     */
    startSpawning(delay: number = 1000) {
        this.scene.time.addEvent({
            delay,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
    }

    /**
     * Creates a new enemy at a random position with random skin and speed.
     */
    private spawnEnemy() {
        const x = Phaser.Math.Between(50, this.scene.scale.width - 50);
        const skin = Phaser.Math.RND.pick(['enemy1', 'enemy2', 'enemy3']);
        const speed = Phaser.Math.Between(120, 220);

        const newEnemy = new Enemy(this.scene, x, -50, skin);
        this.enemyGroup.add(newEnemy);
        newEnemy.setVelocityY(speed);
    }
}
