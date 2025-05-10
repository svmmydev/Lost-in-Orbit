import * as Phaser from 'phaser';
import { BaseScene } from './BaseScene';

export class Score extends BaseScene {
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

    override preload() {
        super.preload();

        this.load.html('leaderboardHTML', 'assets/html/leaderboard.html');
    }

    create() {
        this.createBackground();
        this.createLeaderboard();

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

    private createLeaderboard() {
        const leaderboardDOM = this.add.dom(this.scale.width / 2, this.scale.height / 2)
            .createFromCache('leaderboardHTML')
            .setOrigin(0.5);

        const ul = leaderboardDOM.getChildByID('scoreList') as HTMLUListElement;

        if (Object.keys(this.storedScores).length === 0) { 
            const li = document.createElement('li');
            li.textContent = `No scores to display`;
            li.style.opacity = '0.3';
            ul.appendChild(li);
            return;
        }

        const sorted = Object.entries(this.storedScores).sort(([, a], [, b]) => b - a);

        for (const [name, score] of sorted) {
            const li = document.createElement('li');
            li.textContent = `${name}: ${score}`;

            if (name === this.playerName) {
                li.style.color = '#e29828';
                li.style.fontWeight = 'bold';
            }

            ul.appendChild(li);
        }
    }

    override update() {
        this.scrollBackground(0.1);
    }
}