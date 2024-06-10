const reasons = [
    'Exiting',
    'Quit: safasdfsadfasfd',
    'Reconnecting',
    'Connecting to another server.',
    'Disconnected.',
    'Disconnected by server: %s',
    'Server shutting down: %s',
    'Server->client connection timed out. Last seen %d msec ago.',
    'Unreliable network event overflow.',
    'Game crashed: Recursive error: An exception occurred (c0000005 at 0x7ff6bb17f1c9) during loading of resources:/cars/data/[limiteds]/xmas 4/carvariations.meta in data file mounter 0x141a22350. The game will be terminated.',
    'O jogo crashou: %s',
    'Unhandled exception: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
];
const repeatedReasons = reasons.reduce((acc: string[], reason: string) => {
    const repeatCount = Math.floor(Math.random() * 3) + 1; // Generate a random repeat count between 1 and 3
    const repeatedReasons = Array.from({ length: repeatCount }, () => reason); // Create an array of repeated reasons
    return [...acc, ...repeatedReasons];
}, []);

export const getRandomDropReason = () => {
    return repeatedReasons[Math.floor(Math.random() * repeatedReasons.length)];
}
