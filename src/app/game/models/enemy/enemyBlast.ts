import * as Phaser from 'phaser';

export class EnemyBlast extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'enemyBlast');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setVelocityY(200);

        this.createAnimation(scene);
    }

    override preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (this.y > this.scene.scale.height + this.height) {
            this.destroy();
        }
    }

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
