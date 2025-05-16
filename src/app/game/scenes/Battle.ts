import * as Phaser from 'phaser';
import { Player } from '../models/player/player';
import { PlayerBlast } from '../models/player/playerBlast';
import { Enemy } from '../models/enemy/enemy';
import { BaseScene } from './BaseScene';
import { HUDManager } from '../utils/managers/HUDManager';
import { EnemyGenerator } from '../utils/generators/EnemyGenerator';
import { ExplosionManager } from '../utils/managers/ExplosionManager';
import { PauseManager } from '../utils/managers/PauseManager';
import { TouchControlsManager } from '../utils/managers/TouchControlsManager';
import { PlayerController } from '../utils/controllers/PlayerController';
import { CollisionManager } from '../utils/managers/CollisionManager';
import { GameFlowManager } from '../utils/managers/GameFlowManager';

export class Battle extends BaseScene {
    // MANAGER
    private hudManager!: HUDManager;
    private enemySpawner!: EnemyGenerator;
    private explosionManager!: ExplosionManager;
    private pauseManager!: PauseManager;
    private touchControls!: TouchControlsManager;
    private playerController!: PlayerController;
    private collisionManager!: CollisionManager;
    private gameFlowManager!: GameFlowManager;

    // COMMON GAME VARIABLE
    isGameOver!: boolean;
    isSceneReady = false;
    music!: Phaser.Sound.WebAudioSound;
    pauseBtn!: Phaser.GameObjects.DOMElement;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    spacebar?: Phaser.Input.Keyboard.Key;

    // MODELS VARIABLE
    player!: Player;
    playerName: string = 'Anonymous';
    enemies!: Phaser.Physics.Arcade.Group;
    enemyBullets!: Phaser.Physics.Arcade.Group;
    bullets!: Phaser.Physics.Arcade.Group;

    constructor() {
        super('battle');
    }

    /**
     * Receives data passed when starting the scene.
     * @param data Initial data (e.g. player name).
     */
    init(data: any) {
        this.playerName = data.playerName ?? 'Anonymous';
    }

    /**
     * Preloads assets required by the scene.
     */
    override preload() {
        super.preload();

        // HMTL
        this.load.html('pauseBtn', 'assets/html/pauseButton.html')

        // SPRITE
        this.load.spritesheet('player', 'assets/imgs/sprites/PlayerRed.png', { frameWidth: 64, frameHeight: 64 })
        this.load.spritesheet('playerBlast', 'assets/imgs/sprites/PlayerBlaster.png', { frameWidth: 24, frameHeight: 31 })
        this.load.spritesheet('enemyBlast', 'assets/imgs/sprites/EnemyBlaster.png', { frameWidth: 9, frameHeight: 27 })
        this.load.spritesheet('death', 'assets/imgs/sprites/Explosion1.png', { frameWidth: 64, frameHeight: 64 })

        // IMAGE
        this.load.image('enemy1', 'assets/imgs/enemy/Enemy1.png')
        this.load.image('enemy2', 'assets/imgs/enemy/Enemy2.png')
        this.load.image('enemy3', 'assets/imgs/enemy/Enemy3.png')
        this.load.image('arrow', 'assets/imgs/general/arrow.png')
        this.load.image('shot', 'assets/imgs/general/shot.png')
        this.load.image('health', 'assets/imgs/player/Health.png')
        this.load.image('start', 'assets/imgs/general/start.png')
        this.load.image('pause', 'assets/imgs/general/pause.png')

        // AUDIO
        this.load.audio('battlesong', ['assets/sounds/battlesong.mp3', 'assets/sounds/battlesong.ogg'])
        this.load.audio('explosion', ['assets/sounds/explosion.mp3', 'assets/sounds/explosion.ogg'])
        this.load.audio('playerExplosion', ['assets/sounds/playerexplosion.mp3', 'assets/sounds/playerexplosion.ogg'])
        this.load.audio('enemyShot', ['assets/sounds/enemyshot.mp3', 'assets/sounds/enemyshot.ogg'])
        this.load.audio('playerShot', ['assets/sounds/playershot.mp3', 'assets/sounds/playershot.ogg'])
    }

    /**
     * Sets up all game objects, managers and controls.
     */
    create() {
        this.isGameOver = false;

        this.createBackground();

        // Touch buttons
        this.touchControls = new TouchControlsManager(this);
        this.touchControls.createButtons();

        // Sound config
        const soundConfig: Phaser.Types.Sound.SoundConfig = {
            loop: true,
            volume: 0.3
        }

        this.music = this.sound.add('battlesong', soundConfig) as Phaser.Sound.WebAudioSound;
        this.music.play();

        // Pause
        this.pauseBtn = this.add.dom(this.scale.width - 20, 90)
            .createFromCache('pauseBtn')
            .setOrigin(1, 0)
            .setScale(0.9);
        
        this.pauseManager = new PauseManager(
            this,
            this.pauseBtn,
            this.music,
            () => this.pauseGame()
        );
        this.pauseManager.enable();

        // Player
        const centerX = this.scale.width / 2;
        const bottomY = this.scale.height;

        this.player = new Player(this, centerX, bottomY - 40);
        this.player.setOrigin(0.5, 1);
        this.player.reset();
        this.player.setData('score', 0);

        // User buttons
        this.cursors = this.input.keyboard?.createCursorKeys();
        this.spacebar = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Bullets
        this.bullets = this.physics.add.group({
            classType: PlayerBlast,
            runChildUpdate: true
        });

        // Player controller
        this.playerController = new PlayerController(
            this.player,
            this.cursors!,
            this.spacebar!,
            this.touchControls,
            this.bullets
        );

        // HUD
        this.hudManager = new HUDManager(this, this.player, this.playerName);
        this.hudManager.updateLives();

        this.explosionManager = new ExplosionManager(this, this.player);

        this.gameFlowManager = new GameFlowManager({
            player: this.player,
            music: this.music,
            scene: this,
            explosionManager: this.explosionManager,
            pauseButton: this.pauseBtn,
            hideTouchUI: () => this.touchControls.hideButtons(),
            getScore: () => this.player.getData('score'),
            playerName: this.playerName
        });

        // Enemy
        this.enemies = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();

        this.enemySpawner = new EnemyGenerator(this, this.enemies);
        this.enemySpawner.startSpawning(1000);

        // Collision
        this.collisionManager = new CollisionManager(
            this,
            this.player,
            this.enemies,
            this.enemyBullets,
            this.bullets,
            {
                onPlayerHit: this.handlePlayerHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
                onPlayerBulletHitsEnemy: this.handlePlayerBulletHitsEnemy as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
            }
        );

        this.isSceneReady = true;
    }

    /**
     * Main update loop. Handles enemy updates and player input.
     * @param time Current game time.
     */
    override update(time: number) {
        if (!this.isGameOver) {
            this.scrollBackground(0.7);

            this.enemies.children.iterate((enemy: Phaser.GameObjects.GameObject) => {
                if (enemy.active) {
                    (enemy as Enemy).update(time, this.enemyBullets);
                }
                
                return true;
            });
            
            this.playerController.update(time);
        }
    }

    /**
     * Handles collision when the player is hit.
     * Applies damage and ends the game if necessary.
     */
    private handlePlayerHit = (playerObj: Phaser.GameObjects.GameObject, damaginObj: Phaser.GameObjects.GameObject): void => {
        if (this.isGameOver) return;

        let damage = 1;

        if (damaginObj instanceof Enemy) {
            damage = 2;
            const isDead = damaginObj.takeHit(damage);
            if (isDead) {
                this.sound.play('explosion', { volume: 0.5 });
            }
        }

        damaginObj.destroy();

        if (this.player.loseLife(damage)) {
            this.isGameOver = true;
            this.hudManager.updateLives();

            this.shutdown();
            this.gameFlowManager.endGame();
        } else {
            this.cameras.main.shake(200, 0.015);
            this.hudManager.updateLives();
        }
    };

    /**
     * Handles collision when a player bullet hits an enemy.
     * Destroys the enemy and increases score if killed.
     */
    private handlePlayerBulletHitsEnemy = (bullet: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject): void => {
        bullet.destroy();

        if (enemy instanceof Enemy) {
            const isDead = enemy.takeHit();
            if (isDead) {
                this.sound.play('explosion', { volume: 0.5 });
                this.player.addScore(1);
                this.hudManager.updateScore();
            }
        }
    };

    /**
     * Shows mobile UI buttons.
     */
    showGameUI() {
        this.touchControls.showButtons();
        this.pauseBtn.setVisible(true);
    }

    /**
     * Pauses the game and launches the pause scene.
     * Prevents to show the Pause scene if the plaer is dead.
     * Score scene coming inmediately.
     */
    pauseGame() {
        if (!this.isGameOver) {
            this.touchControls.hideButtons();
            this.pauseBtn.setVisible(false);
            
            this.scene.launch('pause', { music: this.music });
            this.scene.pause();
            this.music.setVolume(0.02);
        }
    }

    /**
     * Cleans up UI and sound before exiting or changing scenes.
     */
    shutdown() {
        this.touchControls.hideButtons();
        this.pauseBtn.setVisible(false);

        this.pauseManager.disable();

        this.sound.stopAll();
    }
}