import React, { useState, useEffect } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { astar } from '../algorithms/astar';
import { backtracking } from '../mazes/backtrackingDfs';
import { primMaze } from '../mazes/prim';

import './PathfindingVisualizer.css';

var START_NODE_ROW = 8;
var START_NODE_COL = 15;
var FINISH_NODE_ROW = 10;
var FINISH_NODE_COL = 35;

var GRID_ROWS = 20;
var GRID_COLS = 40;

export default function PathfindingVisualizer() {
    const [grid, setGrid] = useState([]);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const [canDraw, setCanDraw] = useState(true); // true if visualizer is run/ already ran to disable creating walls
    const [movingStartNode, setMovingStartNode] = useState(false); // if user is moving start node
    const [movingFinishNode, setMovingFinishNode] = useState(false); // if user is moving finish node
    const [gridRows, setGridRows] = useState(20);
    const [gridCols, setGridCols] = useState(40);

    useEffect(() => {
        const newGrid = getInitialGrid();
        setGrid(newGrid);
    }, []);

    const handleMouseDown = (row, col) => {
        if(!canDraw) return;

        if (row === START_NODE_ROW && col === START_NODE_COL) {
            setMovingStartNode(true);
        }
        else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
            setMovingFinishNode(true);
        }
        else {
            const newGrid = getNewGridWithWallToggled(grid, row, col);
            setGrid(newGrid);
        }
        setMouseIsPressed(true);
    }

    const handleMouseEnter = (row, col) => {
        if (!canDraw) return;
        if (!mouseIsPressed) return;

        if (movingStartNode) {
            const newGrid = getNewGridWithStartNodeToggled(grid, row, col);
            setGrid(newGrid);
        }
        else if (movingFinishNode) {
            const newGrid = getNewGridWithFinishNodeToggled(grid, row, col);
            setGrid(newGrid);
        }
        else {
            const newGrid = getNewGridWithWallToggled(grid, row, col);
            setGrid(newGrid);
        }
    }

    const handleMouseUp = () => {
        setMovingStartNode(false);
        setMovingFinishNode(false);
        setMouseIsPressed(false);
    }

    const animateAlgorithm = (visitedNodesInOrder, nodesInShortestPathOrder) => {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).classList.add('node-visited');
            }, 10 * i);
        }
    }

    const animateShortestPath = (nodesInShortestPathOrder) => {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).classList.add('node-shortest-path');
            }, 50 * i);
        }
    }

    const visualizeAlgorithm = (algorithm) => {
        if(!canDraw) return;
        setCanDraw(false);
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        
        var visitedNodesInOrder;
        switch(algorithm){
            case "dijkstra":
                visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
                break;
            case "bfs":
                visitedNodesInOrder = bfs(grid, startNode, finishNode);
                break;
            case "dfs":
                visitedNodesInOrder = dfs(grid, startNode, finishNode);
                break;
            case "astar":
                visitedNodesInOrder = astar(grid, startNode, finishNode);
                break;
            default:
                visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
                break;
        }
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    const generateMaze = (algorithm) => {
        if(!canDraw) return;
        setCanDraw(false);
        const newGrid = getInitialGridWithAllWalls(grid);
        for (let row = 0; row < GRID_ROWS; row++) {
            for (let col = 0; col < GRID_COLS; col++) {
                const node = document.getElementById(`node-${row}-${col}`);
                node.classList.add('node-wall');
            }
        }
        const startNode = grid[START_NODE_ROW][START_NODE_COL];

        var visitedNodesInOrder;
        switch(algorithm){
            case "backtracking":
                visitedNodesInOrder = backtracking(newGrid, startNode);
                break;
            case "prim":
                visitedNodesInOrder = primMaze(newGrid, startNode);
                break;
            default:
                visitedNodesInOrder = backtracking(newGrid, startNode);
        }
        animateMaze(visitedNodesInOrder);
    }

    const animateMaze = (visitedNodesInOrder) => {
        const newGrid = getInitialGridWithAllWalls(grid);
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    const { row, col } = visitedNodesInOrder[Math.floor(Math.random() * visitedNodesInOrder.length)];
                    const newGrid2 = getNewGridWithFinishNodeToggled(newGrid, row, col);
                    setGrid(newGrid2);
                    setCanDraw(true);
                }, 10 * (i+1));
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).classList.remove('node-wall');
                newGrid[node.row][node.col].isWall = false;
            }, 10 * i);
        }
    }


    const clearGrid = (clearWalls=false) => {
        setCanDraw(true);
        const newGrid = clearWalls ? getInitialGrid() : getInitialGridWithWalls(grid);
        setGrid(newGrid);
        for (let row = 0; row < GRID_ROWS; row++) {
            for (let col = 0; col < GRID_COLS; col++) {
                const node = document.getElementById(`node-${row}-${col}`);
                node.classList.remove('node-visited');
                node.classList.remove('node-shortest-path');
            }
        }
    }

    const handleRowSlider = (event) => {
        if(!canDraw) return;
        clearGrid(true);
        const newRowNum = event.target.value
        setGridRows(newRowNum);
        const newGrid = getNewGridWithRowsToggled(newRowNum);
        setGrid(newGrid);
    }

    const handleColSlider = (event) => {
        if(!canDraw) return;
        clearGrid(true);
        const newColNum = event.target.value
        setGridCols(newColNum);
        const newGrid = getNewGridWithColsToggled(newColNum);
        setGrid(newGrid);
    }

    return (
        <>
            <nav className="navbar">
                <div class="navbar">
                    <div class="nav"> 
                        {/* <a href="index.html">Pathfinding Visualizer</a> */}
                        <a to="/dashboard" onClick={() => window.location.reload()}>Pathfinding Visualizer</a>
                    </div>
                </div>
                <div className="dropdown">
                    <button className="dropbtn">Visualize Pathfinding Algorithm  
                    <i className="fa fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                        <button onClick={() => visualizeAlgorithm("dijkstra")}>
                            Dijkstra's Algorithm
                        </button>
                        <button onClick={() => visualizeAlgorithm("bfs")}>
                            Breadth First Search
                        </button>
                        <button onClick={() => visualizeAlgorithm("dfs")}>
                            Depth First Search
                        </button>
                        <button onClick={() => visualizeAlgorithm("astar")}>
                            A* Algorithm
                        </button>
                    </div>
                </div>
                <div className="dropdown">
                    <button className="dropbtn">Maze Generation Algorithm  
                    <i className="fa fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                        <button onClick={() => generateMaze("backtracking")}>
                            Recursive Backtracking
                        </button>
                        <button onClick={() => generateMaze("prim")}>
                            Randomized Prim's Algorithm
                        </button>
                    </div>
                </div>
                <button className="clearButton" onClick={() => clearGrid()}>Clear Path</button>
                <button className="clearButton" onClick={() => clearGrid(true)}>Clear Path and Walls</button>
                <div className="sliders-div">
                    <label for="gridRows">Rows: {gridRows} </label>
                    <input id="gridRows" type="range" min="5" max="30" value={gridRows} step="1" onChange={handleRowSlider}/>
                    <label for="gridCols">Columns: {gridCols} </label>
                    <input id="gridCols" type="range" min="5" max="60" value={gridCols} step="1" onChange={handleColSlider}/>
                </div>
            </nav>
            <br />

            <div className="grid">
                {grid.map((row, rowIdx) => {
                    return (
                        <div key={rowIdx}>
                            {row.map((node, nodeIdx) => {
                                const { row, col, isFinish, isStart, isWall, isVisited } = node;
                                return (
                                    <Node
                                        key={nodeIdx}
                                        col={col}
                                        isFinish={isFinish}
                                        isStart={isStart}
                                        isWall={isWall}
                                        isVisited={isVisited}
                                        mouseIsPressed={mouseIsPressed}
                                        onMouseDown={(row, col) => handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) =>
                                            handleMouseEnter(row, col)
                                        }
                                        onMouseUp={() => handleMouseUp()}
                                        row={row}></Node>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < GRID_ROWS; row++) {
        const currentRow = [];
        for (let col = 0; col < GRID_COLS; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col, row, isWall = false) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall,
        previousNode: null,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNewGridWithStartNodeToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[START_NODE_ROW][START_NODE_COL];
    const newNode = {
        ...node,
        isStart: false,
    };
    newGrid[START_NODE_ROW][START_NODE_COL] = newNode;

    START_NODE_COL = col;
    START_NODE_ROW = row;

    const node2 = newGrid[START_NODE_ROW][START_NODE_COL];
    const newNode2 = {
        ...node2,
        isStart: true,
        isWall: false,
    };
    newGrid[START_NODE_ROW][START_NODE_COL] = newNode2;

    return newGrid;
}

const getNewGridWithFinishNodeToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const newNode = {
        ...node,
        isFinish: false,
    };
    newGrid[FINISH_NODE_ROW][FINISH_NODE_COL] = newNode;

    FINISH_NODE_COL = col;
    FINISH_NODE_ROW = row;

    const node2 = newGrid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const newNode2 = {
        ...node2,
        isFinish: true,
        isWall: false,
    };
    newGrid[FINISH_NODE_ROW][FINISH_NODE_COL] = newNode2;

    return newGrid;
}

const getInitialGridWithWalls = (grid) => {
    const newGrid = [];
    var nodeIsWall = false;
    for (let row = 0; row < GRID_ROWS; row++) {
        const currentRow = [];
        for (let col = 0; col < GRID_COLS; col++) {
            nodeIsWall = grid[row][col].isWall
            currentRow.push(createNode(col, row, nodeIsWall));
        }
        newGrid.push(currentRow);
    }
    return newGrid;
};

const getInitialGridWithAllWalls = (grid) => {
    const newGrid = [];
    for (let row = 0; row < GRID_ROWS; row++) {
        const currentRow = [];
        for (let col = 0; col < GRID_COLS; col++) {
            currentRow.push(createNode(col, row, true));
        }
        newGrid.push(currentRow);
    }
    return newGrid;
};

const getNewGridWithRowsToggled = (newRowNum) => {
    if (START_NODE_ROW >= newRowNum){
        START_NODE_ROW = newRowNum-1;
    }
    if (FINISH_NODE_ROW >= newRowNum){
        FINISH_NODE_ROW = newRowNum-1;
    }
    GRID_ROWS = newRowNum;
    const newGrid = getInitialGrid();
    return newGrid;
}

const getNewGridWithColsToggled = (newColNum) => {
    if (START_NODE_COL >= newColNum){
        START_NODE_COL = newColNum-1;
    }
    if (FINISH_NODE_COL >= newColNum){
        FINISH_NODE_COL = newColNum-1;
    }
    GRID_COLS = newColNum;
    const newGrid = getInitialGrid();
    return newGrid;
}