import * as Phaser from 'phaser';

export class EnemyBlast extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'enemyBlast');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setVelocityY(200);
        this.setCollideWorldBounds(true);
    }

    override preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (this.y > this.scene.scale.height + this.height) {
            this.destroy();
        }
    }
}
