const { Shogi } = require('shogi.js');
const shogi = new Shogi();
shogi.initialize();

console.log('Board structure:');
console.log('board.length:', shogi.board.length);
console.log('board[0]:', shogi.board[0]);
console.log('board[1]:', shogi.board[1]);
console.log('board[9]:', shogi.board[9]);

console.log('\nSample pieces:');
for (let x = 1; x <= 9; x++) {
    for (let y = 1; y <= 9; y++) {
        const piece = shogi.board[x] && shogi.board[x][y];
        if (piece) {
            console.log(`[${x},${y}]: ${piece.kind} ${piece.color}`);
        }
    }
}
