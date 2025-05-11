import * as Phaser from 'phaser';

export class PlayerBlast extends Phaser.Physics.Arcade.Sprite {
    /**
     * Creates a new PlayerBlast instance.
     * @param scene The scene to which this bullet belongs.
     * @param x The initial X position of the bullet.
     * @param y The initial Y position of the bullet.
     */
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'playerBlast');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setVelocityY(-300);

        this.createAnimation(scene);
    }

    /**
     * Automatically called each frame. Destroys the bullet if it goes off-screen.
     * @param time The current time.
     * @param delta The time elapsed since the last frame.
     */
    override preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
    
        if (this.y < -this.height) {
            this.destroy();
        }
    }

    /**
     * Creates the bullet animation if it doesn't already exist.
     * @param scene The scene where the animation is defined.
     */
    createAnimation(scene: Phaser.Scene) {
        if (!scene.anims.exists('bullet_anim')) {
            scene.anims.create({
                key: 'bullet_anim',
                frames: scene.anims.generateFrameNumbers('playerBlast', { start: 0, end: 5 }),
                frameRate: 20,
                repeat: -1
            });
        }
    }
}
