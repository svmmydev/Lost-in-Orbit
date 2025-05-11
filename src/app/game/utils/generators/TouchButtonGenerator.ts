

/**
 * Creates a touch-sensitive rectangular button with an associated image.
 * Useful for mobile on-screen controls.
 *
 * @param scene The Phaser scene where the button is created.
 * @param x The x-coordinate of the button.
 * @param y The y-coordinate of the button.
 * @param width Width of the touch area (rectangle).
 * @param height Height of the touch area (rectangle).
 * @param imageKey The key of the image to display on top of the button.
 * @param imageOptions Visual options for the image (scale, offset, origin, etc.).
 * @param onDown Callback triggered when the button is pressed.
 * @param onUp Callback triggered when the button is released or pointer exits.
 * @returns The image object associated with the button.
 */
export function createTouchButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    imageKey: string,
    imageOptions: {
        scale: number,
        origin: [number, number],
        offsetX?: number,
        offsetY?: number,
        alpha: number,
        flipX?: boolean,
        rotation?: number,
    },
    onDown: () => void,
    onUp: () => void
) {
    const btn = scene.add.rectangle(x, y, width, height)
        .setScrollFactor(0)
        .setInteractive()
        .setAlpha(0.1)
        .setOrigin(imageOptions.origin[0], imageOptions.origin[1]);

    const img = scene.add.image(x - (imageOptions.offsetX ?? 0), y - (imageOptions.offsetY ?? 0), imageKey)
        .setScrollFactor(0)
        .setAlpha(imageOptions.alpha)
        .setOrigin(imageOptions.origin[0], imageOptions.origin[1])
        .setScale(imageOptions.scale);

    if (imageOptions.flipX) img.setFlipX(true);
    if (imageOptions.rotation !== undefined) img.setRotation(imageOptions.rotation);

    btn.on('pointerdown', onDown);
    btn.on('pointerup', onUp);
    btn.on('pointerout', onUp);

    return img;
}