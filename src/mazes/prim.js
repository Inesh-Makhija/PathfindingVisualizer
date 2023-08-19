export function primMaze(grid, startNode) {
    const visitedNodesInOrder = [];
    const lst = [];

    startNode.isWall = false;
    visitedNodesInOrder.push(startNode);
    const choices = [[-2,0],[0,2],[2,0],[0,-2]];
    let neighbors = getUnvisitedNeighbors(startNode, grid , choices);
    lst.push(...neighbors);

    while (lst.length) {
        let rnd = Math.floor(Math.random() * lst.length);
        let [inBetween, frontier] = lst[rnd];
        lst.splice(rnd,1);

        if(frontier.isWall){
            frontier.isWall = false;
            inBetween.isWall = false;
            visitedNodesInOrder.push(inBetween);
            visitedNodesInOrder.push(frontier);
            neighbors = getUnvisitedNeighbors(frontier, grid, choices);
            lst.push(...neighbors);
        }
    }
    return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid, choices) {
    const neighbors = [];
    for(let i = 0 ; i < choices.length ; i++){
        let row = node.row + choices[i][0];
        let col = node.col + choices[i][1];
        if(grid[row] && grid[row][col] && grid[row][col].isWall){
            let frontier = grid[row][col];
            let inBetween = null;
            if(choices[i][0] === -2){
              inBetween = grid[node.row-1][node.col];
            }else if(choices[i][0] === 2){
              inBetween = grid[node.row+1][node.col];
            }else if(choices[i][1] === -2){
              inBetween = grid[node.row][node.col - 1];
            }else if(choices[i][1] === 2){
              inBetween = grid[node.row][node.col + 1];
            }
            neighbors.push([inBetween, frontier]);
        }
    }
    return neighbors;

}