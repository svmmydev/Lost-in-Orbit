import * as Phaser from 'phaser';

export class EnemyBlast extends Phaser.Physics.Arcade.Sprite {
    /**
     * Creates a new enemy projectile instance.
     * @param scene The scene the projectile belongs to.
     * @param x The initial x position.
     * @param y The initial y position.
     */
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'enemyBlast');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setVelocityY(200);

        this.createAnimation(scene);
    }

    /**
     * Automatically called before each frame. Destroys the bullet if it leaves the screen.
     * @param time The current game time.
     * @param delta Time since last frame in ms.
     */
    override preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (this.y > this.scene.scale.height + this.height) {
            this.destroy();
        }
    }

    /**
     * Creates the animation for the enemy bullet if it doesn't already exist.
     * @param scene The scene used to create the animation.
     */
    createAnimation(scene: Phaser.Scene) {
        if (!scene.anims.exists('enemy_bullet')) {
            scene.anims.create({
                key: 'enemy_bullet',
                frames: scene.anims.generateFrameNumbers('enemyBlast', { start: 0, end: 5 }),
                frameRate: 20,
                repeat: -1
            });
        }
    }
}
