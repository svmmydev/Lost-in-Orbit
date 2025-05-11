import Phaser from "phaser";
import { PlayerBlast } from "./playerBlast";

export class Player extends Phaser.Physics.Arcade.Sprite {
    lastDirection: 'left' | 'right' | 'idle' = 'idle';
    shootCooldown = 750;
    thruster!: Phaser.GameObjects.Sprite;
    lastShot = 0;
    lives = 3;
    isDead = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body!.setSize(40, 40).setOffset(12, 15);
        this.setDepth(2);

        this.setDataEnabled();
        this.setData('score', 0);
        this.setCollideWorldBounds(true);

        this.createAnimations(scene);
        this.thruster = scene.add.sprite(this.x, this.y, 'playerBlast')
            .setScale(1.2)
            .setDepth(1);

        this.thruster.play('fuel')
    }

    override update() {
        if (this.isDead) {
            this.thruster.setRotation(this.rotation);
        }
    }

    move(cursors: Phaser.Types.Input.Keyboard.CursorKeys, moveLeft: boolean, moveRight: boolean) {
        this.setVelocity(0);
      
        let currentDirection: 'left' | 'right' | 'idle' = 'idle';
      
        if (cursors.left?.isDown || moveLeft) {
            this.setVelocityX(-220);
            this.setFlipX(false);
            currentDirection = 'left';
        } else if (cursors.right?.isDown || moveRight) {
            this.setVelocityX(220);
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

        this.thruster.setPosition(this.x, this.y - 2);
        this.thruster.setVisible(!this.isDead);
    }

    shoot(bullets: Phaser.Physics.Arcade.Group, time: number) {
        if (time < this.lastShot + this.shootCooldown) return;
    
        const offsetX = 16;
        const bulletY = this.y - 45;
    
        const left = new PlayerBlast(this.scene, this.x - offsetX, bulletY);
        const right = new PlayerBlast(this.scene, this.x + offsetX, bulletY);
    
        bullets.add(left);
        bullets.add(right);

        left.body!.velocity.y = -380;
        right.body!.velocity.y = -380;
    
        this.scene.sound.play('playerShot', { volume: 0.15, loop: false })
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
                frameRate: 0
            })
        }

        if (!scene.anims.exists('fuel')) {
            scene.anims.create({
                key: 'fuel',
                frames: scene.anims.generateFrameNumbers('playerBlast', { start: 0, end: 5 }),
                frameRate: 20,
                repeat: -1
            });
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
            this.thruster.setVisible(false);

            return true;
        }

        return false;
    }

    getLives(): number {
        return this.lives;
    }

    reset(): void {
        this.lives = 3;
        this.isDead = false;
        this.setVelocity(0);
        this.setAngularVelocity(0);
        this.setRotation(0);
        this.setFlipX(false);
        this.setVisible(true);
        this.thruster.setVisible(true);
        this.anims.play('idle', true);
    }
}
