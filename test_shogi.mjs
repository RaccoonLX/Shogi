import { Shogi } from 'shogi.js';
const shogi = new Shogi();
shogi.initialize();

console.log('Board structure:');
console.log('board.length:', shogi.board.length);

console.log('\nSample pieces:');
for (let x = 1; x <= 9; x++) {
    for (let y = 1; y <= 9; y++) {
        const piece = shogi.board[x] && shogi.board[x][y];
        if (piece) {
            console.log(`[${x},${y}]: ${piece.kind} color=${piece.color}`);
        }
    }
}
