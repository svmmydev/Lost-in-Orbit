import * as Phaser from 'phaser';
import { BaseScene } from './BaseScene';
import { SceneHelpers } from '../utils/managers/GameStateManager';

export class Score extends BaseScene {
    music!: Phaser.Sound.BaseSound;
    scoreText!: Phaser.GameObjects.Text;
    storedScores: { [key: string]: number } = {};
    
    playerName: string = 'Anónimo';
    finalScore: number = 0;

    constructor() {
        super('score');
    }

    /**
     * Initializes the score scene with data from the battle scene.
     * Updates the stored high score if the current score is greater.
     * @param data Contains the current score and player name.
     */
    init(data: { score: number, playerName: string }) {
        this.finalScore = data.score;
        this.playerName = data.playerName ?? 'Anónimo';

        const scores = this.registry.get('playerScores') ?? {};
        const previousRecord = scores[this.playerName] ?? 0;

        if (this.finalScore > previousRecord) {
            scores[this.playerName] = this.finalScore;
            this.registry.set('playerScores', scores);
        }

        this.storedScores = scores;
    }

    /**
     * Preloads HTML UI elements for the leaderboard and buttons.
     */
    override preload() {
        super.preload();
        
        this.load.html('scoreUi', 'assets/html/scoreUi.html');
        this.load.html('leaderboardHTML', 'assets/html/leaderboard.html');
    }

    /**
     * Creates the score scene, leaderboard, buttons and music.
     */
    create() {
        this.createBackground();
        this.createLeaderboard();

        // Sound config
        const soundConfig: Phaser.Types.Sound.SoundConfig = {
            loop: true,
            volume: 0.3
        }
                
        this.music = this.sound.add('generalbso', soundConfig) as Phaser.Sound.WebAudioSound;
        this.music.play();

        // Inputs
        this.input.keyboard?.on('keydown-N', () => {
            this.music.stop();
            this.scene.stop();
            this.scene.start('menu');
        });

        this.input.keyboard?.on('keydown-R', () => {
            this.music.stop();
            const battleScene = this.scene.get('battle');
            this.scene.stop();
            this.scene.stop('battle');
            this.scene.start('battle', {
                playerName: (battleScene as any).playerName
            });
        });
    }

    /**
     * Renders the leaderboard DOM and populates it with stored scores.
     */
    private createLeaderboard() {
        // HTML UI
        const leaderboardDOM = this.add.dom(this.scale.width / 2, this.scale.height / 2)
            .createFromCache('leaderboardHTML')
            .setOrigin(0.5);
        
        const buttonsUi = this.add.dom(this.scale.width / 2, this.scale.height - 25)
            .createFromCache('scoreUi')
            .setOrigin(0.5, 1);

        // Buttons events
        buttonsUi.addListener('click');
        buttonsUi.on('click', (event: any) => {
            switch (event.target.id) {
                case 'repeatBtn':
                    SceneHelpers.restartBattle(this);
                    this.scene.stop();
                    this.music.stop();
                    break;
                case 'newPlayerBtn':
                    SceneHelpers.stopToMenu(this);
                    this.scene.stop();
                    this.music.stop();
                    break;
            }
        });

        // Leaderboard rank list
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

    /**
     * Scrolls the background slowly during the score screen.
     */
    override update() {
        this.scrollBackground(0.1);
    }
}