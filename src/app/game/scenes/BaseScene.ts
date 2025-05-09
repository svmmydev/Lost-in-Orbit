// src/app/game/scenes/BaseScene.ts
import * as Phaser from 'phaser';
import { createBackground, scrollBackground } from 'src/app/game/utils/manageBackground';

export abstract class BaseScene extends Phaser.Scene {
    background!: Phaser.GameObjects.TileSprite;

    preload() {
        if (!this.textures.exists('background')) {
            this.load.image('background', 'assets/imgs/background/backgroundseamless.png');
        }
    }

    createBackground() {
        this.background = createBackground(this);
    }

    scrollBackground(speed: number = 1) {
        if (this.background) {
            scrollBackground(this.background, speed);
        }
    }
}
