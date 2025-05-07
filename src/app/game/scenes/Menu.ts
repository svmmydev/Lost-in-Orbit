import * as Phaser from 'phaser';
import { createBackground, scrollBackground } from 'src/app/game/utils/manageBackground';

export class Menu extends Phaser.Scene {
    private background!: Phaser.GameObjects.TileSprite;
    private inputElement!: Phaser.GameObjects.DOMElement;
    private playerName: string = '';
    private errorText!: Phaser.GameObjects.Text;

    constructor() {
        super('menu');
    }

    preload() {
        this.load.image('background', 'assets/imgs/background/backgroundseamless.png')
        this.load.html('userForm', 'assets/html/userForm.html')
    }

    create() {
        this.background = createBackground(this);
      
        this.inputElement = this.add.dom(this.scale.width / 2, this.scale.height / 2).createFromCache('userForm');
      
        this.inputElement.addListener('click');
        this.inputElement.on('click', (event: any) => {
          if (event.target.name === 'startButton') {
            this.procesarEntrada();
          }
        });
      
        this.input.keyboard?.on('keydown-ENTER', () => {
          this.procesarEntrada();
        });
    }

    override update() {
        scrollBackground(this.background, 1);
    }
      
    private procesarEntrada() {
      const input = this.inputElement.getChildByName('playerName') as HTMLInputElement;
    
      if (input?.value.trim()) {
        this.playerName = input.value.trim();
        this.scene.start('battle', { playerName: this.playerName });
      } else {
        this.errorText.setText('Introduce un nick');
      }
    }
}