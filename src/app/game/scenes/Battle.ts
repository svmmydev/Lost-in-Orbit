import * as Phaser from 'phaser';
import { createBackground, scrollBackground } from 'src/app/game/utils/manageBackground';
import { Player } from '../models/player';
import { Blast } from '../models/playerBlast';
import { Enemy } from '../models/enemy';

export class Battle extends Phaser.Scene {
    background!: Phaser.GameObjects.TileSprite;
    playerName: string = 'Anónimo';
    player!: Player;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    spacebar?: Phaser.Input.Keyboard.Key;
    bullets!: Phaser.Physics.Arcade.Group;
    enemies!: Phaser.Physics.Arcade.Group;
    enemyBullets!: Phaser.Physics.Arcade.Group;

    constructor() {
        super('battle');
    }

    init(data: any) {
        this.playerName = data.playerName ?? 'Anónimo';
    }

    preload() {
        this.load.image('background', 'assets/imgs/background/backgroundseamless.png');
        this.load.spritesheet('player', 'assets/imgs/sprites/PlayerRed.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('playerBlast', 'assets/imgs/sprites/PlayerBlaster.png', { frameWidth: 24, frameHeight: 31 });
        this.load.image('enemy1', 'assets/imgs/enemy/Enemy1.png');
        this.load.image('enemy2', 'assets/imgs/enemy/Enemy2.png');
        this.load.image('enemyBlast', 'assets/imgs/enemy/enemy_shot.png');
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

        this.enemies = this.physics.add.group();

        this.enemyBullets = this.physics.add.group();

        this.physics.add.overlap(
            this.bullets,
            this.enemies,
            this.handlePlayerBulletHitsEnemy as unknown as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
          
        this.time.addEvent({
            delay: 1500,
            callback: () => {
                const x = Phaser.Math.Between(50, this.scale.width - 50);
                const skin = Phaser.Math.RND.pick(['enemy1', 'enemy2']);
                const speed = Phaser.Math.Between(100, 180);
                const newEnemy = new Enemy(this, x, -50, skin);
                this.enemies.add(newEnemy);
                newEnemy.setVelocityY(speed);
            },
            callbackScope: this,
            loop: true,
        });
    }

    override update(time: number) {
        scrollBackground(this.background, 0.6);

        this.player.move(this.cursors!);

        if (Phaser.Input.Keyboard.JustDown(this.spacebar!)) {
            this.player.shoot(this.bullets, time);
        }

        this.enemies.children.iterate((enemy: Phaser.GameObjects.GameObject) => {
            (enemy as Enemy).update(time, this.enemyBullets);
            return true;
        });
    }

    handlePlayerBulletHitsEnemy(bullet: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
        console.log('COLISIÓN', bullet, enemy);
        bullet.destroy();
        (enemy as Enemy).takeHit();
      }
}