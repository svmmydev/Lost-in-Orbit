import * as Phaser from 'phaser';
import { createBackground, scrollBackground } from 'src/app/utils/createBackground';

export class Battle extends Phaser.Scene {
    private background!: Phaser.GameObjects.TileSprite;

    constructor() {
        super('battle');
    }

    preload() {
        this.load.image('background', 'assets/imgs/background/backgroundseamless.png')
    }

    create() {
        this.background = createBackground(this);
    }

    override update() {
        scrollBackground(this.background, 1);
    }
}