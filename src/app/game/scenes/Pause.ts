export class Pause extends Phaser.Scene {
    constructor() {
        super('pause');
    }
  
    create() {
        const { width, height } = this.scale;
    
        this.add.text(width / 2, height / 2, 'P A U S E', {
            fontSize: '40px',
            fontFamily: 'Verdana',
            color: '#ffffff',
        }).setOrigin(0.5);

        this.add.text(width / 2, height, '[P] Resume    |    [R] Reset', {
            fontSize: '16px',
            fontFamily: 'Verdana',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 21);
  
        this.input.keyboard?.on('keydown-P', () => {
            this.scene.stop();
            this.scene.resume('battle');
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
}