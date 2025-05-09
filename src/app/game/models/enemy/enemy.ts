import Phaser from "phaser";
import { EnemyBlast } from "./enemyBlast";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    shootCooldown = 2500;
    lastShot = 0;
    health = 2;

    constructor(scene: Phaser.Scene, x: number, y: number, skin: string) {
        super(scene, x, y, skin);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        const newWidth = this.width * 0.7;
        const newHeight = this.height * 0.5;

        this.body!.setSize(newWidth, newHeight);

        this.body!.setOffset(
            (this.width - newWidth) / 2,
            (this.height - newHeight) / 2
        );

        this.setCollideWorldBounds(true);

        this.createAnimations(scene);
    }

    takeHit(damage: number = 1): boolean {
        this.health -= damage;
        
        if (this.health <= 0) {
            this.explode();
            this.destroy();
            return true;
        }

        return false;
    }

    override update(time: number, bullets: Phaser.Physics.Arcade.Group) {
        if (time > this.lastShot + this.shootCooldown) {
          this.shoot(bullets);
          this.lastShot = time;
        }
    }

    shoot(bullets: Phaser.Physics.Arcade.Group) {
        const blast = new EnemyBlast(this.scene, this.x, this.y + this.height / 2);
        bullets.add(blast);
        blast.setActive(true).setVisible(true);
        blast.body!.velocity.y = 280;
        blast.flipY = true;

        blast.setActive(true).setVisible(true).play('enemy_bullet');
    }

    createAnimations(scene: Phaser.Scene) {
        if (!scene.anims.exists('enemyDeath')) {
            scene.anims.create({
                key: 'enemyDeath',
                frames: this.anims.generateFrameNumbers('enemyDeath', { start: 0, end: 8 }),
                frameRate: 15,
                hideOnComplete: true
            });
        }
    }

    private explode() {
        this.scene.physics.add.sprite(this.x, this.y, 'enemyDeath')
                .setOrigin(0.5)
                .setVelocityY(this.body!.velocity.y)
                .play('enemyDeath');
    }
}
