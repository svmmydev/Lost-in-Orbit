import Phaser from "phaser";
import { PlayerBlast } from "./playerBlast";

export class Player extends Phaser.Physics.Arcade.Sprite {
    lastDirection: 'left' | 'right' | 'idle' = 'idle';
    shootCooldown = 750;
    lastShot = 0;
    lives = 3;
    isDead = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body!.setSize(40, 40);
        this.body!.setOffset(12, 15);

        this.setDataEnabled();
        this.setData('score', 0);
        this.setCollideWorldBounds(true);

        this.createAnimations(scene);
    }

    move(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        this.setVelocity(0);
      
        let currentDirection: 'left' | 'right' | 'idle' = 'idle';
      
        if (cursors.left?.isDown) {
            this.setVelocityX(-270);
            this.setFlipX(false);
            currentDirection = 'left';
        } else if (cursors.right?.isDown) {
            this.setVelocityX(270);
            this.setFlipX(true);
            currentDirection = 'right';
        }
      
        if (currentDirection !== 'idle') {
            if (this.anims.currentAnim?.key !== 'move' || this.lastDirection !== currentDirection) {
                this.anims.play('move');
            }
        } else {
            this.anims.play('idle', true);
        }
      
        this.lastDirection = currentDirection;
    }

    shoot(bullets: Phaser.Physics.Arcade.Group, time: number) {
        if (time < this.lastShot + this.shootCooldown) return;
    
        const offsetX = 16;
        const bulletY = this.y - 45;
    
        const left = new PlayerBlast(this.scene, this.x - offsetX, bulletY);
        const right = new PlayerBlast(this.scene, this.x + offsetX, bulletY);
    
        bullets.add(left);
        bullets.add(right);

        left.body!.velocity.y = -400;
        right.body!.velocity.y = -400;
    
        left.setActive(true).setVisible(true).setScale(1.3).play('bullet_anim');
        right.setActive(true).setVisible(true).setScale(1.3).play('bullet_anim');
    
        this.lastShot = time;
    }
    

    addScore(amount: number) {
        this.setData('score', this.getData('score') + amount);
    }

    createAnimations(scene: Phaser.Scene) {
        if (!scene.anims.exists('move')) {
            scene.anims.create({
                key: 'move',
                frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
                frameRate: 20,
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
    
    loseLife(damage: number = 1): boolean {
        if (this.lives <= 0) return true;

        this.lives -= damage;

        if (this.lives <= 0) {
            this.lives = 0;
            this.isDead = true;
            this.setVelocity(0);
            this.anims.play('idle', true);
            return true;
        }

        return false;
    }

    getLives(): number {
        return this.lives;
    }
}
