import * as Phaser from 'phaser';
import { createBackground, scrollBackground } from 'src/app/utils/manageBackground';

export class Score extends Phaser.Scene {
    private background!: Phaser.GameObjects.TileSprite;

    constructor() {
        super('score');
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