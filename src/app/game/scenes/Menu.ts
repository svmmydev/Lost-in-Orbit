import * as Phaser from 'phaser';
import { BaseScene } from './BaseScene';

export class Menu extends BaseScene {
	inputElement!: Phaser.GameObjects.DOMElement;
	inputElements!: Phaser.GameObjects.DOMElement;
	playerName: string = '';
	errorText!: Phaser.GameObjects.Text;
	music!: Phaser.Sound.WebAudioSound;

	constructor() {
		super('menu');
	}

	override preload() {
		super.preload();
		this.load.html('userForm', 'assets/html/userForm.html')
		this.load.image('logo', 'assets/imgs/general/lostinorbit.png')
		this.load.audio('generalbso', 'assets/sounds/generalbso.ogg')
	}

	create() {
		this.createBackground();

		const soundConfig: Phaser.Types.Sound.SoundConfig = {
			loop: true,
			volume: 0.08
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
					this.procesarEntrada();
				}
		});
	
		this.input.keyboard?.on('keydown-ENTER', () => {
			this.procesarEntrada();
		});
	}
	override update() {
		this.scrollBackground(0.1);
	}
		
	private procesarEntrada() {
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