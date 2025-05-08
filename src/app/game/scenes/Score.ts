import * as Phaser from 'phaser';
import { createBackground, scrollBackground } from 'src/app/game/utils/manageBackground';

export class Score extends Phaser.Scene {
    background!: Phaser.GameObjects.TileSprite;
    scoreText!: Phaser.GameObjects.Text;
    finalScore: number = 0;

    constructor() {
        super('score');
    }

    init(data: { score: number }) {
        this.finalScore = data.score;
    }

    preload() {
        this.load.image('background', 'assets/imgs/background/backgroundseamless.png')
    }

    create() {
        this.background = createBackground(this);

        this.scoreText = this.add.text(15, 15, `${this.finalScore}`, {
            fontFamily: 'Verdana',
            fontSize: '17px',
            color: '#ffffff',
        }).setOrigin(0, 0);
    }

    override update() {
        scrollBackground(this.background, 0.1);
    }
}

//TODO: ALMACENAR LA PUNTUACIÓN DE CADA NICK Y MOSTRAR EN SCORE