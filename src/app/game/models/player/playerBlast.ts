import * as Phaser from 'phaser';

export class PlayerBlast extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'playerBlast');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setVelocityY(-300);

        this.createAnimation(scene);
    }

    override preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
    
        if (this.y < -this.height) {
            this.destroy();
        }
    }

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
