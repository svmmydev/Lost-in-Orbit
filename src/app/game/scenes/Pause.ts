
export class Pause extends Phaser.Scene {
    music!: Phaser.Sound.WebAudioSound;

    constructor() {
        super('pause');
    }

    init(data: { music: Phaser.Sound.WebAudioSound }) {
        this.music = data.music;
    }
  
    create() {
        const { width, height } = this.scale;
    
        this.add.text(width / 2, height / 2 - 50, 'P A U S E', {
            fontSize: '25px',
            fontFamily: 'pixel_font',
            color: '#ffffff',
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 + 50, '[P] Resume\n\n[R] Reset', {
            fontSize: '13px',
            fontFamily: 'pixel_font',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
  
        this.input.keyboard?.on('keydown-P', () => {
            this.music.setVolume(0.08);
            this.scene.stop();
            this.scene.resume('battle');
        });

        this.input.keyboard?.on('keydown-R', () => {
            const battleScene = this.scene.get('battle');

            this.scene.stop();
            this.scene.stop('battle');
            this.music.stop();

            this.scene.start('battle', {
                playerName: (battleScene as any).playerName
            });
        });
    }
}