import * as Phaser from 'phaser';
import { createBackground, scrollBackground } from 'src/app/game/utils/manageBackground';
import { Player } from '../models/player';
import { Blast } from '../models/playerBlast';

export class Battle extends Phaser.Scene {
    background!: Phaser.GameObjects.TileSprite;
    playerName: string = 'Anónimo';
    player!: Player;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    spacebar?: Phaser.Input.Keyboard.Key;
    bullets!: Phaser.Physics.Arcade.Group;


    constructor() {
        super('battle');
    }

    init(data: any) {
        this.playerName = data.playerName ?? 'Anónimo';
    }

    preload() {
        this.load.image('background', 'assets/imgs/background/backgroundseamless.png')
        this.load.spritesheet('player', 'assets/imgs/sprites/PlayerRed.png', { frameWidth: 64, frameHeight: 64 })
        this.load.spritesheet('playerBlast', 'assets/imgs/sprites/PlayerBlaster.png', { frameWidth: 24, frameHeight: 31 })
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
        this.spacebar = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.bullets = this.physics.add.group({
            classType: Blast,
            runChildUpdate: true
        });
    }

    override update(time: number) {
        scrollBackground(this.background, 1);

        this.player.move(this.cursors!);

        if (Phaser.Input.Keyboard.JustDown(this.spacebar!)) {
            this.player.shoot(this.bullets, time);
        }
    }
}