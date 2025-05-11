import Phaser from 'phaser';
import { createTouchButton } from '../generators/TouchButtonGenerator';

/**
 * Manages the touch controls: left, right and fire buttons.
 */
export class TouchControlsManager {
    moveLeft = false;
    moveRight = false;
    tryShoot = false;

    private scene: Phaser.Scene;
    private moveLeftBtn!: Phaser.GameObjects.Image;
    private moveRightBtn!: Phaser.GameObjects.Image;
    private fireBtn!: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    /**
     * Creates the touch buttons and sets their event callbacks.
     */
    createButtons() {
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;

        const btnWidth = width / 2;
        const btnHeight = 120;

        this.moveLeftBtn = createTouchButton(
            this.scene,
            0, height,
            btnWidth, btnHeight,
            'arrow',
            { scale: 0.10, origin: [0, 1], offsetX: -40, offsetY: 20, alpha: 0.3, flipX: true },
            () => this.moveLeft = true,
            () => this.moveLeft = false
        );

        this.moveRightBtn = createTouchButton(
            this.scene,
            width, height,
            btnWidth, btnHeight,
            'arrow',
            { scale: 0.10, origin: [1, 1], offsetX: 40, offsetY: 20, alpha: 0.3 },
            () => this.moveRight = true,
            () => this.moveRight = false
        );

        this.fireBtn = createTouchButton(
            this.scene,
            width, height - 120,
            100, btnHeight + 80,
            'shot',
            { scale: 2, origin: [1, 1], offsetX: 18, offsetY: 90, alpha: 0.3, rotation: Phaser.Math.DegToRad(-90) },
            () => this.tryShoot = true,
            () => this.tryShoot = false
        );
    }

    /**
     * Hides all touch buttons (useful when pausing).
     */
    hideButtons() {
        this.moveLeftBtn.setVisible(false);
        this.moveRightBtn.setVisible(false);
        this.fireBtn.setVisible(false);
    }

    /**
     * Shows all touch buttons.
     */
    showButtons() {
        this.moveLeftBtn.setVisible(true);
        this.moveRightBtn.setVisible(true);
        this.fireBtn.setVisible(true);
    }
}
