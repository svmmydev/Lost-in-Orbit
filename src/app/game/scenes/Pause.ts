import { SceneHelpers } from "../utils/managers/GameStateManager";

export class Pause extends Phaser.Scene {
    music!: Phaser.Sound.WebAudioSound;

    constructor() {
        super('pause');
    }

    /**
     * Receives music data from the battle scene.
     * @param data Object containing the music instance.
     */
    init(data: { music?: Phaser.Sound.WebAudioSound }) {
        this.music = data.music!;
    }

    /**
     * Preloads the HTML UI used in the pause scene.
     */
    preload() {
        this.load.html('menuUi', 'assets/html/menuUi.html')
    }

    /**
     * Creates pause menu text, keyboard events, and UI buttons.
     */
    create() {
        const { width, height } = this.scale;
    
        // UI
        this.add.text(width / 2, height / 2 - 50, 'P A U S E', {
            fontSize: '25px',
            fontFamily: 'pixel_font',
            color: '#ffffff',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 2,
                stroke: false,
                fill: true
            }
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 + 50, '[P] Resume\n\n\n[R] Reset\n\n\n[N] New player', {
            fontSize: '13px',
            fontFamily: 'pixel_font',
            color: '#ffffff',
            align: 'center',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 2,
                stroke: false,
                fill: true
            }
        }).setOrigin(0.5);

        // Buttons
        const buttonsUi = this.add.dom(this.scale.width / 2, this.scale.height / 2 + 150)
            .createFromCache('menuUi');

        buttonsUi.addListener('click');
        buttonsUi.on('click', (event: any) => {
            switch (event.target.id) {
                case 'startBtn':
                    this.resumeGame();
                    break;
                case 'resetBtn':
                    this.resetGame();
                    break;
                case 'newPlayerBtn':
                    this.newPlayer();
                    break;
            }
        });
  
        // Inputs
        this.input.keyboard?.on('keydown-P', () => {
            this.resumeGame();
        });

        this.input.keyboard?.on('keydown-R', () => {
            this.resetGame();
        });

        this.input.keyboard?.on('keydown-N', () => {
            this.newPlayer();
        });
    }

    /**
     * Resumes the battle scene and restores the UI and music volume.
     */
    resumeGame() {
        if (this.music) {
            this.music.setVolume(0.3);
        }

        const battleScene = this.scene.get('battle') as any;

        battleScene.showGameUI();

        this.scene.stop();
        this.scene.resume('battle');
    }

    /**
     * Restarts the battle scene using SceneHelpers.
     */
    resetGame() {
        SceneHelpers.restartBattle(this);
        this.scene.stop();
    }

    /**
     * Stops current scenes and returns to the menu scene.
     */
    newPlayer() {
        SceneHelpers.stopToMenu(this);
        this.scene.stop();
    }
}