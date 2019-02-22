import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square (props) {
  let className = 'square'
  if (props.isBold) {
    className += ' bold'
  }
  if (props.isWin) {
    className += ' win'
  }
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare (i) {
    let isBold = false
    if (this.props.boldSquare === i) {
      isBold = true
    }
    let isWin = false
    for (let j = 0; j < this.props.line.length; j++) {
      if (i === this.props.line[j]) {
        isWin = true
        break
      }
    }
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isBold={isBold}
        isWin={isWin}
      />
    )
  }

  render () {
    return (
      <div>
        <div className='board-row'>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className='board-row'>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className='board-row'>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    )
  }
}

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        boldSquare: null
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares).winner || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
        boldSquare: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo (step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render () {
    const history = this.state.history
    console.log(history)
    const current = history[this.state.stepNumber]
    const response_winner = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      const desc = move
        ? 'Go to move #' + move
        : 'Go to game start'
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status
    if (response_winner.winner) {
      status = 'Winner: ' + response_winner.winner
    } else {
      let is_null = false
      for (let i = 0; i < current.squares.length; ++i) {
        if (current.squares[i] == null) { is_null = true; break }
      }
      if (is_null) {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
      } else {
        status = 'Draw!'
      }
    }

    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            boldSquare={current.boldSquare}
            line={response_winner.line}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)

function calculateWinner (squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        'line': [a, b, c],
        'winner': squares[a]
      }
    }
  }
  return {
    'line': [],
    'winner': null
  }
}
