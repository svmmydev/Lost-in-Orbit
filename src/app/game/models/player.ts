import Phaser from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setDataEnabled();
        this.setData('score', 0);
    }

    move(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        this.setVelocity(0);

        if (cursors.left?.isDown) {
            this.setVelocityX(-160);
            this.anims.play('left', true);
        } else if (cursors.right?.isDown) {
            this.setVelocity(160);
            this.anims.play('right', true);
        } else {
            this.anims.play('idle', true);
        }
    }

    addScore(amount: number) {
        this.setData('score', this.getData('score') + amount);
    }
}
