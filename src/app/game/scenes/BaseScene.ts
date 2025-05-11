import * as Phaser from 'phaser';
import { createBackground, scrollBackground } from 'src/app/game/utils/managers/BackgroundManager';

export abstract class BaseScene extends Phaser.Scene {
    background!: Phaser.GameObjects.TileSprite;

    /**
     * Preloads the background image if it hasn't already been loaded.
     */
    preload() {
        if (!this.textures.exists('background')) {
            this.load.image('background', 'assets/imgs/background/backgroundseamless.png');
        }
    }

    /**
     * Creates the background tile sprite using a utility function.
     */
    createBackground() {
        this.background = createBackground(this);
    }

    /**
     * Scrolls the background vertically to create a movement effect.
     * @param speed The speed at which the background scrolls (default is 1).
     */
    scrollBackground(speed: number = 1) {
        if (this.background) {
            scrollBackground(this.background, speed);
        }
    }
}
