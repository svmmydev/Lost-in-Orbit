import Phaser from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setDataEnabled();
        this.setData('score', 0);

        this.createAnimations(scene);
    }

    move(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        this.setVelocity(0);

        if (cursors.left?.isDown) {
            this.setVelocityX(-160);
            this.setFlipX(false);
            this.anims.play('left', true);
        } else if (cursors.right?.isDown) {
            this.setVelocity(160);
            this.setFlipX(true);
            this.anims.play('right', true);
        } else {
            this.anims.play('idle', true);
        }
    }

    addScore(amount: number) {
        this.setData('score', this.getData('score') + amount);
    }

    createAnimations(scene: Phaser.Scene) {
        if (!scene.anims.exists('left')) {
            scene.anims.create({
                key: 'left',
                frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: 0
            })
        }

        if (!scene.anims.exists('right')) {
            scene.anims.create({
                key: 'right',
                frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: 0
            })
        }

        if (!scene.anims.exists('idle')) {
            scene.anims.create({
                key: 'idle',
                frames: [{ key: 'player', frame : 0 }],
                frameRate: 1
            })
        }
    }
}
