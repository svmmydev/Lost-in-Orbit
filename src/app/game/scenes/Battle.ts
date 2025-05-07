import * as Phaser from 'phaser';
import { createBackground, scrollBackground } from 'src/app/game/utils/manageBackground';
import { Player } from '../models/player';

export class Battle extends Phaser.Scene {
    background!: Phaser.GameObjects.TileSprite;
    playerName: string = 'Anónimo';
    player!: Player;


    constructor() {
        super('battle');
    }

    init(data: any) {
        this.playerName = data.playerName ?? 'Anónimo';
    }

    preload() {
        this.load.image('background', 'assets/imgs/background/backgroundseamless.png')
    }

    create() {
        this.background = createBackground(this);
        this.add.text(20, 15, this.playerName, {
            fontSize: '17px',
            color: '#ffffff',
        }).setOrigin(0);
    }

    override update() {
        scrollBackground(this.background, 1);
    }
}