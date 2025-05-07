import Phaser from "phaser";
import { EnemyBlast } from "./enemyBlast";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    shootCooldown = 1500;
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
    }

    takeHit() {
        this.health--;

        if (this.health <= 0) {
          this.destroy();
        }
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
        blast.body!.velocity.y = 300;
    }
}
