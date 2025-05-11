import * as Phaser from 'phaser';
import { Player } from '../../models/player/player';

export class HUDManager {
    private scene: Phaser.Scene;
    private player: Player;
    private playerName: string;
    private healthIcons: Phaser.GameObjects.Image[] = [];
    private scoreText!: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, player: Player, playerName: string) {
        this.scene = scene;
        this.player = player;
        this.playerName = playerName;
        this.createHUD();
    }

    /**
     * Initializes name, score, and life icons.
     */
    private createHUD() {
        this.scene.add.text(15, 40, this.playerName, {
            fontFamily: 'pixel_font',
            fontSize: '13px',
            color: '#e09f3c',
            shadow: {
                offsetX: 0, offsetY: 0, color: '#00000',
                blur: 3, stroke: true, fill: true
            }
        }).setOrigin(0, 0);

        this.scoreText = this.scene.add.text(15, 70, 'Score: 0', {
            fontFamily: 'pixel_font',
            fontSize: '13px',
            color: '#e09f3c',
            shadow: {
                offsetX: 0, offsetY: 0, color: '#00000',
                blur: 3, stroke: true, fill: true
            }
        }).setOrigin(0, 0);

        this.updateLives();
    }

    /**
     * Updates visible hearts based on player's lives.
     */
    updateLives() {
        this.healthIcons.forEach(icon => icon.destroy());
        this.healthIcons = [];

        for (let i = 0; i < this.player.getLives(); i++) {
            const heart = this.scene.add.image(this.scene.scale.width - 15 + (i * -45), 50, 'health')
                .setScale(0.9)
                .setScrollFactor(0)
                .setDepth(2)
                .setOrigin(1, 0);

            this.healthIcons.push(heart);
        }
    }

    /**
     * Refreshes the score display.
     */
    updateScore() {
        this.scoreText.setText(`Score: ${this.player.getData('score')}`);
    }
}
