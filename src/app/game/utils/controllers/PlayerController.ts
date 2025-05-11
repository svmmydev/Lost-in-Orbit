import Phaser from 'phaser';
import { Player } from '../../models/player/player';
import { TouchControlsManager } from '../managers/TouchControlsManager';

/**
 * Handles player-specific input and actions.
 */
export class PlayerController {
    private player: Player;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private spacebar: Phaser.Input.Keyboard.Key;
    private touchControls: TouchControlsManager;
    private bullets: Phaser.Physics.Arcade.Group;

    constructor(
        player: Player,
        cursors: Phaser.Types.Input.Keyboard.CursorKeys,
        spacebar: Phaser.Input.Keyboard.Key,
        touchControls: TouchControlsManager,
        bullets: Phaser.Physics.Arcade.Group
    ) {
        this.player = player;
        this.cursors = cursors;
        this.spacebar = spacebar;
        this.touchControls = touchControls;
        this.bullets = bullets;
    }

    /**
     * Updates player input and actions.
     * @param time Current game time (used for cooldowns).
     */
    update(time: number) {
        this.player.move(this.cursors, this.touchControls.moveLeft, this.touchControls.moveRight);

        if (Phaser.Input.Keyboard.JustDown(this.spacebar) || this.touchControls.tryShoot) {
            this.player.shoot(this.bullets, time);
            this.touchControls.tryShoot = false;
        }

        this.player.update(); // actualiza propulsor, animaciones, etc.
    }

    getPlayer(): Player {
        return this.player;
    }
}
