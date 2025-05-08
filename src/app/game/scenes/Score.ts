import * as Phaser from 'phaser';
import { createBackground, scrollBackground } from 'src/app/game/utils/manageBackground';

export class Score extends Phaser.Scene {
    background!: Phaser.GameObjects.TileSprite;
    scoreText!: Phaser.GameObjects.Text;
    playerName: string = 'Anónimo';
    finalScore: number = 0;
    storedScores: { [key: string]: number } = {};

    constructor() {
        super('score');
    }

    init(data: { score: number, playerName: string }) {
        this.finalScore = data.score;
        this.playerName = data.playerName ?? 'Anónimo';

        const scoresJson = localStorage.getItem('playerScores');
        const scores = scoresJson ? JSON.parse(scoresJson) : {};

        const previousRecord = scores[this.playerName] ?? 0;

        if (this.finalScore > previousRecord) {
            scores[this.playerName] = this.finalScore;
            localStorage.setItem('playerScores', JSON.stringify(scores));
        }

        this.storedScores = scores;
    }

    preload() {
        this.load.image('background', 'assets/imgs/background/backgroundseamless.png')
    }

    create() {
        this.background = createBackground(this);

        this.add.text(15, 60, 'Leaderboard:', {
            fontFamily: 'Verdana',
            fontSize: '17px',
            color: '#ffffff',
        }).setOrigin(0, 0);
        
        const sorted = Object.entries(this.storedScores)
            .sort(([, a], [, b]) => b - a)
        
        let offsetY = 90;
        for (const [name, score] of sorted) {
            this.add.text(15, offsetY, `${name}: ${score}`, {
                fontFamily: 'Verdana',
                fontSize: '16px',
                color: '#ffffff',
            }).setOrigin(0, 0);
            offsetY += 25;
        }

        this.add.text(15, 50, 'G A M E    O V E R', {
            fontSize: '16px',
            fontFamily: 'Verdana',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0, 0);

        this.add.text(15, 120, '[R] Repeat   |   [N] New player', {
            fontSize: '16px',
            fontFamily: 'Verdana',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0, 0);

        this.input.keyboard?.on('keydown-N', () => {
            this.scene.stop();
            this.scene.start('menu');
        });

        this.input.keyboard?.on('keydown-R', () => {
            const battleScene = this.scene.get('battle');

            this.scene.stop();
            
            this.scene.stop('battle');

            this.scene.start('battle', {
                playerName: (battleScene as any).playerName
            });
        });
    }

    override update() {
        scrollBackground(this.background, 0.1);
    }
}