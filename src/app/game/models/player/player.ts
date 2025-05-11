import Phaser from "phaser";
import { PlayerBlast } from "./playerBlast";

export class Player extends Phaser.Physics.Arcade.Sprite {
    private currentDirection: 'left' | 'right' | 'idle' = 'idle';
    private shootCooldown = 750;
    private thruster!: Phaser.GameObjects.Sprite;
    private lastShot = 0;
    private health = 3;
    private isDead = false;

    /**
     * Creates a new player instance.
     * @param scene The scene this player belongs to
     * @param x Initial X position
     * @param y Initial Y position
     */
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

    /**
     * Updates player logic each frame.
     */
    override update() {
        if (this.isDead) {
            this.thruster.setRotation(this.rotation);
        }
    }

    /**
     * Handles movement input.
     * @param cursors Keyboard cursors
     * @param moveLeft Mobile touch input for moving left
     * @param moveRight Mobile touch input for moving right
     */
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
            if (this.anims.currentAnim?.key !== 'move' || this.currentDirection !== currentDirection) {
                this.anims.play('move');
            }
        } else {
            this.anims.play('idle', true);
        }
      
        this.currentDirection = currentDirection;

        this.thruster.setPosition(this.x, this.y - 2);
        this.thruster.setVisible(!this.isDead);
    }

    /**
     * Fires a pair of bullets if cooldown has passed.
     * @param bullets Group where bullets will be added
     * @param time Current time (used for cooldown)
     */
    shoot(bullets: Phaser.Physics.Arcade.Group, time: number) {
        if (time < this.lastShot + this.shootCooldown) return;

        // Pos variables
        const offsetX = 16;
        const bulletY = this.y - 45;

        // Blasts
        const left = new PlayerBlast(this.scene, this.x - offsetX, bulletY);
        const right = new PlayerBlast(this.scene, this.x + offsetX, bulletY);

        bullets.addMultiple([left, right]);
        this.configureBullet(left);
        this.configureBullet(right);

        this.scene.sound.play('playerShot', { volume: 0.15 });
        this.lastShot = time;
    }

    /**
     * Configures a single bullet's velocity, visibility, and animation.
     * @param blast The bullet instance to configure.
     */
    private configureBullet(blast: PlayerBlast) {
        blast.body!.velocity.y = -380;
        blast.setActive(true).setVisible(true).setScale(1.3).play('bullet_anim');
    }
    
    /**
     * Adds score to the player.
     * @param amount Score points to add
     */
    addScore(amount: number) {
        this.setData('score', this.getData('score') + amount);
    }
    
    /**
     * Reduces player's health. If it reaches 0, marks the player as dead.
     * @param damage Amount of damage to apply (default is 1).
     * @returns True if the player died as a result, false otherwise.
     */
    loseLife(damage: number = 1): boolean {
        if (this.health <= 0) return true;

        this.health -= damage;

        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
            this.setVelocity(0);
            this.anims.play('idle', true);
            this.thruster.setVisible(false);

            return true;
        }

        return false;
    }

    /**
     * Returns the player's current number of lives.
     * @returns The number of lives remaining.
     */
    getLives(): number {
        return this.health;
    }

    /**
     * Resets the player to its initial state for a new session.
     */
    reset(): void {
        this.health = 3;
        this.isDead = false;
        this.setVelocity(0);
        this.setAngularVelocity(0);
        this.setRotation(0);
        this.setFlipX(false);
        this.setVisible(true);
        this.thruster.setVisible(true);
        this.anims.play('idle', true);
    }

    /**
     * Creates player-related animations if they don't already exist.
     * @param scene The scene where animations are defined.
     */
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
}
