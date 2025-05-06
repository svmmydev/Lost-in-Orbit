import * as Phaser from 'phaser';

export function createBackground(scene: Phaser.Scene, key = 'background') {
  const bg = scene.add.tileSprite(
    0,
    0,
    scene.cameras.main.width,
    scene.cameras.main.height,
    key
  ).setOrigin(0);

  // Escalado dinámico horizontal
  const imgWidth = scene.textures.get(key).getSourceImage().width;
  const scaleX = scene.cameras.main.width / imgWidth;
  bg.tileScaleX = scaleX;

  return bg;
}

export function scrollBackground(bg: Phaser.GameObjects.TileSprite, speed = 1) {
    bg.tilePositionY -= speed;
  }
