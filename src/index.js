import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Button, ButtonGroup, Typography, Grid} from '@mui/material';
import xPic from './img/X.png';
import oPic from './img/O.png';

function Square(props) {
  if (props.value ==='X'){
    return (
      <button className="square" onClick={props.onClick}>
        <img className="x_pic" src={xPic} alt="X"></img>
      </button>
    );
  }else if(props.value ==='O') {
    return(
      <button className="square" onClick={props.onClick}>
        <img className="o_pic" src={oPic} alt="X"></img>
        </button>
    );
  }else {
    return(
      <button className="square" onClick={props.onClick}>
        </button>
    );
  }

}

class Board extends React.Component {


  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
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

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history =this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice(); 
    //ignore click if square is filled or the game is finished
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X': 'O';
    this.setState({
      history: history.concat([{
        squares: squares, 
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    }) ;
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step, 
      xIsNext: (step % 2) === 0,
    });
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves =history.map((step, move) =>{
      const desc = move ? 'Go to move #' + move : 'Go to start';
      // these are the buttons that show which move to go back to 
      return (
        <li key={move}> 
          <Button onClick={() => this.jumpTo(move) } color="secondary" size="small">{desc}</Button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O');
    }
    return (
      <div>
        <Typography variant="h3"  className="gameheader" align="center">
          Tic Tac Toe
        </Typography>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6} md={8} className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
           />
        </Grid>
        <Grid item xs={6} md={4} className="game-info">
          <Typography variant="h5"  className="thestatus" >
          { status }
          </Typography>
          <ButtonGroup className="movesbutton" orientation="vertical" aria-label="vertical contained button group" variant="contained">
            {moves}
          </ButtonGroup>
        </Grid>
      </Grid>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
