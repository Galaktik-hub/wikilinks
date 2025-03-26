export function preventCtrlF(): void {
    document.addEventListener('keydown', function(event) {
        const isCtrlPressed = event.ctrlKey || event.metaKey;
        const isFKeyPressed = event.key.toLowerCase() === 'f';
        const isF3Pressed = event.key === 'F3';

        if ((isCtrlPressed && isFKeyPressed) || isF3Pressed) {
            event.preventDefault();
            alert('La fonction de recherche est désactivée pendant le jeu.');
        }
    });
}
