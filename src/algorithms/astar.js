export function astar(grid, startNode, finishNode){
    const visitedNodesInOrder = [];
    
    // nodes to be evaluted
    const open = [];
    // nodes already evaluated
    const closed = [];
    
    startNode.fValue = calculateDistance(startNode, finishNode);
    open.push(startNode);
    while(open.length){
        console.log(visitedNodesInOrder);
        const current = open.shift();

        if(current.isVisited) continue; 

        visitedNodesInOrder.push(current);
        current.isVisited = true;

        if (current === finishNode) return visitedNodesInOrder;

        const neighbors = getNeighbors(grid, current, open, closed);

        for(const neighbor of neighbors){
            if(!open.includes(neighbor) && !open.includes(neighbor)){
                open.push(neighbor);
                const fValue = calculateDistance(startNode, neighbor) + calculateDistance(neighbor, finishNode);
                if(neighbor.fValue){
                    if (fValue < neighbor.fValue){
                        neighbor.fValue = fValue;
                        neighbor.previousNode = current;
                    }
                } else {
                    neighbor.fValue = fValue;
                    neighbor.previousNode = current;
                }
            }
        }
        closed.push(current);
        sortNodesByDistance(open);
    }
    return visitedNodesInOrder;
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.fValue - nodeB.fValue);
}

function getNeighbors(grid, node, open, closed) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter((neighbor) => !neighbor.isWall);
    
}

function calculateDistance(node1, node2) {
    return Math.abs(node1.col - node2.col) + Math.abs(node1.row - node2.row);
}