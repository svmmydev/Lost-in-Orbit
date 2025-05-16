import * as Phaser from 'phaser';
import { BaseScene } from './BaseScene';

export class Menu extends BaseScene {
	inputElement!: Phaser.GameObjects.DOMElement;
	inputElements!: Phaser.GameObjects.DOMElement;
	errorText!: Phaser.GameObjects.Text;
	music!: Phaser.Sound.WebAudioSound;

	playerName: string = '';

	constructor() {
		super('menu');
	}

	/**
	 * Preloads assets required by the menu scene.
	 * Includes logo image, form HTML and background music.
	 */
	override preload() {
		super.preload();
		this.load.html('userForm', 'assets/html/userForm.html')
		this.load.image('logo', 'assets/imgs/general/lostinorbit.png')
		this.load.audio('generalbso', 'assets/sounds/generalbso.mp3', 'assets/sounds/generalbso.ogg')
	}

	/**
	 * Creates the menu scene with background, logo, form and music.
	 * Handles click and keyboard events for player input.
	 */
	create() {
		this.createBackground();

		const soundConfig: Phaser.Types.Sound.SoundConfig = {
			loop: true,
			volume: 0.3
		}
		
		this.music = this.sound.add('generalbso', soundConfig) as Phaser.Sound.WebAudioSound;
		this.music.play();

		this.add.image(this.scale.width / 1.9, this.scale.height / 2.93, 'logo')
			.setTint(0x000000)
			.setAlpha(0.18)
			.setScale(0.24)
			.setOrigin(0.5);

		this.add.image(this.scale.width / 2, this.scale.height / 3.05, 'logo')
			.setOrigin(0.5)
			.setScale(0.25);
	
		this!.inputElement = this.add.dom(this.scale.width / 2, this.scale.height / 2).createFromCache('userForm').setOrigin(0.5, 0).setDepth(999);
	
		this.inputElement.addListener('click');
		this.inputElement.on('click', (event: any) => {
				if (event.target.name === 'startButton') {
					this.processInput();
				}
		});
	
		this.input.keyboard?.on('keydown-ENTER', () => {
			this.processInput();
		});
	}

	/**
	 * Scrolls the background slowly while in the menu scene.
	 */
	override update() {
		this.scrollBackground(0.1);
	}
	
	/**
	 * Processes the input form.
	 * If the name is valid, the game starts.
	 * Otherwise, displays an error message.
	 */
	processInput() {
		const input = this.inputElement.getChildByName('playerName') as HTMLInputElement;
		const errorMessage = this.inputElement.getChildByID('errorMessage') as HTMLParagraphElement;
	
		if (input?.value.trim()) {
			this.music.stop();
			this.playerName = input.value.trim().toUpperCase();
			this.scene.start('battle', { playerName: this.playerName });
		} else {
			errorMessage.textContent = 'Insert a nick';
		}
	}
}