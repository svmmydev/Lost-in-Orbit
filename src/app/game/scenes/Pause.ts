import { SceneHelpers } from "../utils/manageGameState";
import { Battle } from "./Battle";

export class Pause extends Phaser.Scene {
    music!: Phaser.Sound.WebAudioSound;

    constructor() {
        super('pause');
    }

    init(data: { music?: Phaser.Sound.WebAudioSound }) {
        this.music = data.music!;
    }

    preload() {
        this.load.html('menuUi', 'assets/html/menuUi.html')
    }

    create() {
        const { width, height } = this.scale;
    
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

    resumeGame() {
        if (this.music) {
            this.music.setVolume(0.3);
        }

        const battleScene = this.scene.get('battle') as any;

        battleScene.moveLeftBtn.setVisible(true);
        battleScene.moveRightBtn.setVisible(true);
        battleScene.fireBtn.setVisible(true);
        battleScene.pauseBtn.setVisible(true);

        this.scene.stop();
        this.scene.resume('battle');
    }

    resetGame() {
        SceneHelpers.restartBattle(this);
        this.scene.stop();
    }

    newPlayer() {
        SceneHelpers.stopToMenu(this);
        this.scene.stop();
    }
}