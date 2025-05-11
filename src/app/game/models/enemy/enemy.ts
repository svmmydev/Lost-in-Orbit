import Phaser from "phaser";
import { EnemyBlast } from "./enemyBlast";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    private shootCooldown = 3500;
    private lastShot = 0;
    private health = 2;

    /**
     * Creates a new enemy instance.
     * @param scene The scene the enemy belongs to
     * @param x The x position of the enemy
     * @param y The y position of the enemy
     * @param skin The texture key for the enemy sprite
     */
    constructor(scene: Phaser.Scene, x: number, y: number, skin: string) {
        super(scene, x, y, skin);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Pos variables
        const newWidth = this.width * 0.9;
        const newHeight = this.height * 0.5;

        // Positioning
        this.body!.setSize(newWidth, newHeight);
        this.body!.setOffset(
            (this.width - newWidth) / 2,
            (this.height - newHeight) / 2
        );

        this.setCollideWorldBounds(true);

        this.createAnimations(scene);
    }

    /**
     * Reduces enemy health when hit.
     * @param damage Amount of damage to apply (default is 1)
     * @returns True if the enemy died, otherwise false
     */
    takeHit(damage: number = 1): boolean {
        this.health -= damage;
        
        if (this.health <= 0) {
            this.explode();
            this.destroy();
            return true;
        }

        return false;
    }

    /**
     * Updates enemy behavior each frame.
     * @param time Current game time
     * @param bullets Group to add enemy bullets to
     */
    override update(time: number, bullets: Phaser.Physics.Arcade.Group) {
        if (this.y > this.scene.scale.height + this.height) {
            this.setActive(false);
            this.setVisible(false);
        }

        if (time > this.lastShot + this.shootCooldown) {
            this.shoot(bullets);
            this.lastShot = time;
        }
    }

    /**
     * Fires a bullet downward.
     * @param bullets Group to which the bullet is added
     */
    shoot(bullets: Phaser.Physics.Arcade.Group) {
        const blast = new EnemyBlast(this.scene, this.x, this.y + this.height / 2);
        bullets.add(blast);
        blast.setActive(true).setVisible(true);
        blast.body!.velocity.y = 280;
        blast.flipY = true;

        this.scene.sound.play('enemyShot', { volume: 0.1, loop: false })
        blast.setActive(true).setVisible(true).play('enemy_bullet');
    }

    /**
     * Creates the animation used for enemy death.
     * @param scene The current game scene
     */
    createAnimations(scene: Phaser.Scene) {
        if (!scene.anims.exists('death')) {
            scene.anims.create({
                key: 'death',
                frames: this.anims.generateFrameNumbers('death', { start: 0, end: 8 }),
                frameRate: 15,
                hideOnComplete: true
            });
        }
    }

    /**
     * Triggers the explosion effect when the enemy dies.
     */
    explode() {
        this.scene.physics.add.sprite(this.x, this.y, 'death')
                .setOrigin(0.5)
                .setVelocityY(this.body!.velocity.y)
                .play('death');
    }
}
