import Phaser from 'phaser';

/**
 * Handles pause behavior when player clicks the button or the app is minimized.
 */
export class PauseManager {
    private scene: Phaser.Scene;
    private pauseButton: Phaser.GameObjects.DOMElement;
    private music: Phaser.Sound.BaseSound;
    private onManualPause: () => void;

    constructor(
        scene: Phaser.Scene,
        pauseButton: Phaser.GameObjects.DOMElement,
        music: Phaser.Sound.BaseSound,
        onManualPause: () => void
    ) {
        this.scene = scene;
        this.pauseButton = pauseButton;
        this.music = music;
        this.onManualPause = onManualPause;
    }

    /**
     * Registers all pause-related events.
     */
    enable() {
        this.pauseButton.addListener('click');
        this.pauseButton.on('click', (event: any) => {
            if (event.target.id === 'pauseBtn') {
                this.onManualPause();
            }
        });

        this.scene.input.keyboard?.on('keydown-P', this.onManualPause);

        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        this.scene.game.events.on(Phaser.Core.Events.BLUR, this.onManualPause);
        this.scene.game.events.on(Phaser.Core.Events.HIDDEN, this.onManualPause);
    }

    /**
     * Removes all listeners and events when shutting down.
     */
    disable() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        this.scene.game.events.off(Phaser.Core.Events.BLUR, this.onManualPause);
        this.scene.game.events.off(Phaser.Core.Events.HIDDEN, this.onManualPause);
    }

    /**
     * Handles tab/app being hidden.
     */
    private handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            this.onManualPause();
        }
    };
}
