import * as Phaser from 'phaser';
import { Player } from '../models/player/player';
import { PlayerBlast } from '../models/player/playerBlast';
import { Enemy } from '../models/enemy/enemy';
import { BaseScene } from './BaseScene';

export class Battle extends BaseScene {
    playerName: string = 'Anónimo';
    scoreText!: Phaser.GameObjects.Text;
    livesText!: Phaser.GameObjects.Text;
    player!: Player;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    spacebar?: Phaser.Input.Keyboard.Key;
    bullets!: Phaser.Physics.Arcade.Group;
    enemies!: Phaser.Physics.Arcade.Group;
    enemyBullets!: Phaser.Physics.Arcade.Group;
    isGameOver!: boolean;

    constructor() {
        super('battle');
    }

    init(data: any) {
        this.playerName = data.playerName ?? 'Anónimo';
    }

    override preload() {
        super.preload();
        this.load.spritesheet('player', 'assets/imgs/sprites/PlayerRed.png', { frameWidth: 64, frameHeight: 64 })
        this.load.spritesheet('playerBlast', 'assets/imgs/sprites/PlayerBlaster.png', { frameWidth: 24, frameHeight: 31 })
        this.load.spritesheet('enemyBlast', 'assets/imgs/sprites/EnemyBlaster.png', { frameWidth: 9, frameHeight: 27 })
        this.load.spritesheet('death', 'assets/imgs/sprites/Explosion1.png', { frameWidth: 64, frameHeight: 64 })
        this.load.image('enemy1', 'assets/imgs/enemy/Enemy1.png')
        this.load.image('enemy2', 'assets/imgs/enemy/Enemy2.png')
        this.load.image('enemy3', 'assets/imgs/enemy/Enemy3.png')
    }

    create() {
        this.createBackground();
        this.isGameOver = false;

        const centerX = this.scale.width / 2;
        const bottomY = this.scale.height;

        this.player = new Player(this, centerX, bottomY - 40);
        this.player.setOrigin(0.5, 1);

        this.scoreText = this.add.text(15, 12, 'Score: 0', {
            fontFamily: 'pixel_font',
            fontSize: '11px',
            color: '#e09f3c',
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#00000',
                blur: 3,
                stroke: true,
                fill: true
            }
        }).setOrigin(0, 0);

        this.livesText = this.add.text(this.scale.width / 2 - 10, 12, `Lives: ${this.player.getLives()}`, {
            fontFamily: 'pixel_font',
            fontSize: '11px',
            color: '#e09f3c',
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#00000',
                blur: 3,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.32, 0);

        this.add.text(this.scale.width - 15, 12, this.playerName, {
            fontFamily: 'pixel_font',
            fontSize: '11px',
            color: '#e09f3c',
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#00000',
                blur: 3,
                stroke: true,
                fill: true
            }
        }).setOrigin(1, 0);

        this.cursors = this.input.keyboard?.createCursorKeys();
        this.spacebar = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.bullets = this.physics.add.group({
            classType: PlayerBlast,
            runChildUpdate: true
        });

        this.enemies = this.physics.add.group();

        this.enemyBullets = this.physics.add.group();

        this.physics.add.overlap(
            this.player,
            this.enemyBullets,
            this.handlePlayerHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.handlePlayerHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
        

        this.physics.add.overlap(
            this.bullets,
            this.enemies,
            this.handlePlayerBulletHitsEnemy as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
          
        this.time.addEvent({
            delay: 1500,
            callback: () => {
                const x = Phaser.Math.Between(50, this.scale.width - 50);
                const skin = Phaser.Math.RND.pick(['enemy1', 'enemy2', 'enemy3']);
                const speed = Phaser.Math.Between(120, 250);
                const newEnemy = new Enemy(this, x, -50, skin);
                this.enemies.add(newEnemy);
                newEnemy.setVelocityY(speed);
            },
            callbackScope: this,
            loop: true,
        });

        this.input.keyboard?.on('keydown-P', () => {
            this.scene.launch('pause');
            this.scene.pause();
        });
          
    }

    override update(time: number) {
        if (!this.isGameOver) {
            this.scrollBackground(0.7);

            this.player.move(this.cursors!);

            if (Phaser.Input.Keyboard.JustDown(this.spacebar!)) {
                this.player.shoot(this.bullets, time);
            }

            this.enemies.children.iterate((enemy: Phaser.GameObjects.GameObject) => {
                (enemy as Enemy).update(time, this.enemyBullets);
                return true;
            });
        }
    }

    handlePlayerBulletHitsEnemy(bullet: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
        bullet.destroy();

        if (enemy instanceof Enemy) {
            const isDead = enemy.takeHit();

            if (isDead) {
                this.player.addScore(1);
                this.scoreText.setText(`Score: ${this.player.getData('score')}`);
            }
        }
    }

    handlePlayerHit (playerObj: Phaser.GameObjects.GameObject, damaginObj: Phaser.GameObjects.GameObject) {
        let damage = 1;

        if (damaginObj instanceof Enemy) {
            damage = 2;
            damaginObj.takeHit(damage);
        }

        damaginObj.destroy();
      
        if (this.player.loseLife(damage)) {
            this.updateLivesText();
            this.isGameOver = true;
            this.spawnExplosionsRafagas();

            this.time.delayedCall(3000, () => {
                this.scene.start('score', {
                    score: this.player.getData('score'),
                    playerName: this.playerName
                });
            });
        } else {
            this.cameras.main.shake(200, 0.01);
            this.updateLivesText();
        }
    }
    
    updateLivesText() {
        this.livesText.setText(`Lives: ${this.player.getLives()}`);
    }

    spawnExplosionsRafagas() {
        const centerX = this.player.x;
        const centerY = this.player.y;

        const offsets = [
            { x: -5, y: -40 },
            { x: -20, y: -20 },
            { x: 10, y: -20 }
        ];

        let count = 0;

        const interval = this.time.addEvent({
            delay: 800,
            repeat: 2,
            callback: () => {
                offsets.forEach(offset => {
                    this.add.sprite(centerX + offset.x, centerY + offset.y, 'death')
                        .setOrigin(0.5)
                        .play('death');
                });
                count++;
            }
        });
    }

}