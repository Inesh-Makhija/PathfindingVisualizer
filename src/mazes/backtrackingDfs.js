export function backtracking(grid, startNode) {
    const visitedNodesInOrder = [];
    const stack = [];

    startNode.isWall = false;
    visitedNodesInOrder.push(startNode);
    const choices = [[-2,0],[0,2],[2,0],[0,-2]];
    let neighbors = getUnvisitedNeighbors(startNode, grid , choices);
    
    let rnd = Math.floor(Math.random () * neighbors.length);
    stack.push(neighbors[rnd]);

    while (stack.length) {
        let [inBetween, frontier] = stack[stack.length - 1];
        frontier.isWall = false;
        visitedNodesInOrder.push(frontier);
        
        inBetween.isWall = false;
        visitedNodesInOrder.push(inBetween);
        neighbors = getUnvisitedNeighbors(frontier,grid,choices);
        if(neighbors.length){
            rnd = Math.floor(Math.random () * neighbors.length);
            stack.push(neighbors[rnd]);
        } else{
            stack.pop();
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