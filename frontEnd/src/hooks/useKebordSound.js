const keyStrokSound = [
    new Audio('/sounds/keystroke1.mp3'),
    new Audio('/sounds/keystroke2.mp3'),
    new Audio('/sounds/keystroke3.mp3'),
    new Audio('/sounds/keystroke4.mp3'),
]

function useKeyboardSound() {
    const platRandomeSound = () => {
        const randomeSound = keyStrokSound[Math.floor(Math.random() * keyStrokSound.length)];
        randomeSound.currentTime = 0 ;
        randomeSound.play().catch((error) => {
            console.error("Error playing sound:", error);
        });
    }


    return { platRandomeSound }
}

export default useKeyboardSound;