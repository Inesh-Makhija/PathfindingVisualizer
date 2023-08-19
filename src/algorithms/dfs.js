export function dfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const stack = [];
    stack.push(startNode);

    while (stack.length) {
        const currentNode = stack.pop();
        
        if (currentNode.isWall) continue;
        
        if(currentNode.isVisited) continue; 

        visitedNodesInOrder.push(currentNode);
        currentNode.isVisited = true;

        if (currentNode === finishNode) return visitedNodesInOrder;
        
        const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of unvisitedNeighbors) {
            neighbor.previousNode = currentNode;
        }
        stack.push(...unvisitedNeighbors);
    }
    return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter((neighbor) => !neighbor.isVisited);
}