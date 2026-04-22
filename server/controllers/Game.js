const getGames = (req, res) => {
  res.json([
    { id: 'speedGarden', name: 'Speed Garden' },
    { id: 'reactionDash', name: 'Reaction Dash' },
    { id: 'memoryFlip', name: 'Memory Flip' },
    { id: 'puzzleGrid', name: 'Puzzle Grid' }
  ]);
};

module.exports = { getGames };