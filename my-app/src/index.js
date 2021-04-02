import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.className} onClick ={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  className(i) {
    if (i === this.props.focusIndex){
      return 'square-focus';
    } else {
      return 'square';
    }
  }
  
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        //  we’ll pass down a function from the Board to the Square
        onClick={()=>this.props.onClick(i)}
        className = {this.className(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    }
  }

  

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    //slice does not alter the original array. 
    //It returns a shallow copy of elements from the original array.
    const squares = current.squares.slice();
    if(calculateWinner(squares)||squares[i]){
      return null;
    }
    squares[i] = this.state.xIsNext?'X':'O';
    this.setState({
      //Unlike the array push() method you might be more familiar with, 
      //the concat() method doesn’t mutate the original array, so we prefer it.
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      xIsNext: (step%2) === 0,
      stepNumber: step,
    });
  }

  

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let newstep;
      if (move > 0){
        let cur = history[move];
        let last = history[move -1];
        newstep = diffStep(cur['squares'], last['squares']);
      } else {
        newstep = {
          col: -1,
          row: -1,
        }
      }
      const desc = move ? `Go to move #${move} : col:${newstep.col}, row:${newstep.row}` : `Go to game start`;
      return (
        <li key={move}>
          <button onClick={()=>this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let newstep;
    if (this.state.stepNumber > 0) {
      const lastone = history[this.state.stepNumber-1];
      newstep = diffStep(current['squares'], lastone['squares']);
    } else {
      newstep = {
        col: -1,
        row: -1,
        index: 0,
      }
    }
    

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
            focusIndex = {newstep.index}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function diffStep(cur, last) {
  for(let i = 0; i < cur.length; i++) {
    if (cur[i] !== last[i]) {
      const col = ((i+1)%3) ? (i+1)%3 : 3;
      const row = Math.ceil((i+1)/3);
      return ({
        col: col,
        row: row,
        index: i,
      });
    }
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
