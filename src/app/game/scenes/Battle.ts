import * as Phaser from 'phaser';
import { createBackground, scrollBackground } from 'src/app/game/utils/manageBackground';
import { Player } from '../models/player';

export class Battle extends Phaser.Scene {
    background!: Phaser.GameObjects.TileSprite;
    playerName: string = 'Anónimo';
    player!: Player;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;


    constructor() {
        super('battle');
    }

    init(data: any) {
        this.playerName = data.playerName ?? 'Anónimo';
    }

    preload() {
        this.load.image('background', 'assets/imgs/background/backgroundseamless.png')
        this.load.spritesheet('player', 'assets/imgs/sprites/PlayerRed.png', { frameWidth: 64, frameHeight: 64 })
    }

    create() {
        this.background = createBackground(this);

        this.add.text(20, 15, this.playerName, {
            fontSize: '17px',
            color: '#ffffff',
        }).setOrigin(0);

        const centerX = this.scale.width / 2;
        const bottomY = this.scale.height;

        this.player = new Player(this, centerX, bottomY - 40);
        this.player.setOrigin(0.5, 1);


        this.cursors = this.input.keyboard?.createCursorKeys();
    }

    override update() {
        scrollBackground(this.background, 1);

        this.player.move(this.cursors!);
    }
}