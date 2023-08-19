import React from 'react';

import './Node.css';

export default function Node({ col, isFinish, isStart, isWall, isVisited, onMouseDown, onMouseEnter, onMouseUp, row}) {
    const extraClassName = isFinish 
        ? 'node-finish' 
        : isStart 
            ? 'node-start'
            : isWall
                ? 'node-wall'
                // : isVisited
                //     ? 'node-visited'
                    : '';
    return (
        <div
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={() => onMouseUp()}></div>
    );
}