import * as Phaser from 'phaser';
import { Player } from '../models/player/player';
import { PlayerBlast } from '../models/player/playerBlast';
import { Enemy } from '../models/enemy/enemy';
import { BaseScene } from './BaseScene';
import { createTouchButton } from '../utils/touchControlHelper';

export class Battle extends BaseScene {
    playerName: string = 'Anónimo';
    moveLeft = false;
    moveRight = false;
    tryShoot = false;
    scoreText!: Phaser.GameObjects.Text;
    livesText!: Phaser.GameObjects.Text;
    player!: Player;
    healthIcons: Phaser.GameObjects.Image[] = [];
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    spacebar?: Phaser.Input.Keyboard.Key;
    bullets!: Phaser.Physics.Arcade.Group;
    enemies!: Phaser.Physics.Arcade.Group;
    enemyBullets!: Phaser.Physics.Arcade.Group;
    isGameOver!: boolean;
    music!: Phaser.Sound.WebAudioSound;

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
        this.load.image('arrow', 'assets/imgs/general/arrow.png')
        this.load.image('shot', 'assets/imgs/general/shot.png')
        this.load.image('health', 'assets/imgs/player/Health.png')
        this.load.audio('battlesong', 'assets/sounds/battlesong.ogg')
        this.load.audio('explosion', 'assets/sounds/explosion.ogg')
        this.load.audio('playerExplosion', 'assets/sounds/playerexplosion.ogg')
        this.load.audio('enemyShot', 'assets/sounds/enemyshot.ogg')
        this.load.audio('playerShot', 'assets/sounds/playershot.ogg')
    }

    create() {
        this.createBackground();

        const soundConfig: Phaser.Types.Sound.SoundConfig = {
            loop: true,
            volume: 0.08
        }

        this.music = this.sound.add('battlesong', soundConfig) as Phaser.Sound.WebAudioSound;

        this.music.play();
        
        this.isGameOver = false;

        const btnWidth = this.scale.width / 2;
        const btnHeight = 120;

        createTouchButton(
            this,
            0,
            this.scale.height,
            btnWidth,
            btnHeight,
            'arrow',
            { scale: 0.15, origin: [0, 1], offsetX: -40, offsetY: 10, alpha: 0.3, flipX: true },
            () => this.moveLeft = true,
            () => this.moveLeft = false
        );

        createTouchButton(
            this,
            this.scale.width,
            this.scale.height,
            btnWidth,
            btnHeight,
            'arrow',
            { scale: 0.15, origin: [1, 1], offsetX: 40, offsetY: 10, alpha: 0.3 },
            () => this.moveRight = true,
            () => this.moveRight = false
        );

        createTouchButton(
            this,
            this.scale.width,
            this.scale.height - 120,
            100,
            btnHeight + 80,
            'shot',
            { scale: 2, origin: [1, 1], offsetX: 18, offsetY: 90, alpha: 0.3, rotation: Phaser.Math.DegToRad(-90) },
            () => this.tryShoot = true,
            () => this.tryShoot = false
        );

        const centerX = this.scale.width / 2;
        const bottomY = this.scale.height;

        this.player = new Player(this, centerX, bottomY - 40);
        this.player.setOrigin(0.5, 1);

        this.add.text(15, 40, this.playerName, {
            fontFamily: 'pixel_font',
            fontSize: '17px',
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

        this.scoreText = this.add.text(15, 70, 'Score: 0', {
            fontFamily: 'pixel_font',
            fontSize: '17px',
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

        for (let i = 0; i < this.player.getLives(); i++) {
            const heart = this.add.image(this.scale.width - 15 + (i * - 45), 50, 'health')
                .setScale(0.9)
                .setScrollFactor(0)
                .setDepth(2)
                .setOrigin(1, 0);

            this.healthIcons.push(heart);
        }

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
            delay: 1000,
            callback: () => {
                const x = Phaser.Math.Between(50, this.scale.width - 50);
                const skin = Phaser.Math.RND.pick(['enemy1', 'enemy2', 'enemy3']);
                const speed = Phaser.Math.Between(120, 220);
                const newEnemy = new Enemy(this, x, -50, skin);
                this.enemies.add(newEnemy);
                newEnemy.setVelocityY(speed);
            },
            callbackScope: this,
            loop: true,
        });

        this.input.keyboard?.on('keydown-P', () => {
            this.scene.launch('pause', { music: this.music });
            this.scene.pause();
            this.music.setVolume(0.02);
        });
          
    }

    override update(time: number) {
        if (!this.isGameOver) {
            this.scrollBackground(0.7);

            this.player.move(this.cursors!, this.moveLeft, this.moveRight);

            if (Phaser.Input.Keyboard.JustDown(this.spacebar!) || this.tryShoot) {
                this.player.shoot(this.bullets, time);
                this.tryShoot = false;
            }

            this.enemies.children.iterate((enemy: Phaser.GameObjects.GameObject) => {
                if (enemy.active) {
                    (enemy as Enemy).update(time, this.enemyBullets);
                }
                
                return true;
            });

            this.player.update();
        }
    }

    handlePlayerBulletHitsEnemy(bullet: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
        bullet.destroy();

        if (enemy instanceof Enemy) {
            const isDead = enemy.takeHit();

            if (isDead) {
                this.sound.play('explosion', { volume: 0.5 })
                this.player.addScore(1);
                this.scoreText.setText(`Score: ${this.player.getData('score')}`);
            }
        }
    }

    handlePlayerHit (playerObj: Phaser.GameObjects.GameObject, damaginObj: Phaser.GameObjects.GameObject) {
        if (this.isGameOver) return;

        let damage = 1;

        if (damaginObj instanceof Enemy) {
            damage = 2;
            const isDead = damaginObj.takeHit(damage);
            if (isDead) {
                this.sound.play('explosion', { volume: 0.5 })
            }
        }

        damaginObj.destroy();
      
        if (this.player.loseLife(damage)) {
            this.isGameOver = true;
            
            this.updateLives();

            this.player.setVelocityY(-45);
            this.player.setAngularVelocity(10);

            this.music.stop();
            this.spawnExplosionsRafagas();

            this.time.delayedCall(3000, () => {
                this.music.stop();
                this.scene.start('score', {
                    score: this.player.getData('score'),
                    playerName: this.playerName
                });
            });
        } else {
            this.cameras.main.shake(200, 0.015);
            this.updateLives();
        }
    }
    
    updateLives() {
        const currentLives = this.player.getLives();

        this.healthIcons.forEach((icon, index) => {
            icon.setVisible(index < currentLives);
        })
    }

    spawnExplosionsRafagas() {
        const offsets = [
            { x: -5, y: -40 },
            { x: -20, y: -20 },
            { x: 10, y: -20 }
        ];

        this.time.addEvent({
            delay: 800,
            repeat: 2,
            callback: () => {
                const centerX = this.player.x;
                const centerY = this.player.y;

                offsets.forEach(offset => {
                    this.add.sprite(centerX + offset.x, centerY + offset.y, 'death')
                        .setOrigin(0.5)
                        .play('death')
                        .setDepth(3);
                });
                
                this.sound.play('playerExplosion', { volume: 0.2 })
            }
        });
    }
}