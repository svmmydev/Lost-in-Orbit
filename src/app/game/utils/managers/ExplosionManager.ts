import * as Phaser from 'phaser';
import { Player } from '../../models/player/player';

/**
 * Manages the visual and audio explosion effects for the player.
 */
export class ExplosionManager {
    private scene: Phaser.Scene;
    private player: Player;

    constructor(scene: Phaser.Scene, player: Player) {
        this.scene = scene;
        this.player = player;
    }

    /**
     * Spawns 3 explosion bursts over the player's **current position** each time.
     */
    spawnRafagas() {
        const offsets = [
            { x: -5, y: -40 },
            { x: -20, y: -20 },
            { x: 10, y: -20 }
        ];

        this.scene.time.addEvent({
            delay: 800,
            repeat: 2,
            callback: () => {
                const x = this.player.x;
                const y = this.player.y;

                offsets.forEach(offset => {
                    this.scene.add.sprite(x + offset.x, y + offset.y, 'death')
                        .setOrigin(0.5)
                        .play('death')
                        .setDepth(3);
                });

                this.scene.sound.play('playerExplosion', { volume: 0.2 });
            }
        });
    }
}
