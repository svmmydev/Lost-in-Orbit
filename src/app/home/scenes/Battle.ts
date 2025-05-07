import * as Phaser from 'phaser';
import { createBackground, scrollBackground } from 'src/app/utils/manageBackground';

export class Battle extends Phaser.Scene {
    private background!: Phaser.GameObjects.TileSprite;
    private playerName: string = 'Anónimo';

    constructor() {
        super('battle');
    }

    init(data: any) {
        this.playerName = data.playerName ?? 'Anónimo';
    }

    preload() {
        
    }

    create() {
        this.background = createBackground(this);
        this.add.text(this.scale.width / 2, this.scale.height / 2, `Bienvenido, ${this.playerName}`, {
            fontSize: '28px',
            color: '#ffffff',
        }).setOrigin(0.5);
    }

    override update() {
        scrollBackground(this.background, 1);
    }
}