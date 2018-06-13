import React, {Component} from 'react';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      gameBoard: this.createGame(7, 6),
      playerTurn: 'Player One',
      winner: false,
      tie: false,
      score: {
        'Player One': 0,
        'Player Two': 0
      }
    }

    this.createGame = this.createGame.bind(this);
    this.displayGame = this.displayGame.bind(this);
    this.createRow = this.createRow.bind(this);
    this.clickSpot = this.clickSpot.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  createGame(cols, rows) {
    let gameStructure = [];
    let row = '-'.repeat(cols).split('');
    for(var i = 0; i < rows; i++) {
      gameStructure.push([...row]);
    };
    return gameStructure
  }

  displayGame() {
    const {gameBoard} = this.state;

    return gameBoard.map((row, i) => {
      return (
        <div className="row">
          {this.createRow(row, i)}
        </div>
      )
    })
  }

  clickSpot(e) {
    const {gameBoard, playerTurn} = this.state;

    let coordinate = JSON.parse(e.target.getAttribute('data-coordinate'));
    let columnIndex = coordinate[1];
    let rowIndex = coordinate[0];
    let playerSymbol = playerTurn == 'Player One' ? 'X' : 'O';
    let copyGameBoard = [...gameBoard]

    for(var i = copyGameBoard.length - 1; i >= 0; i--) {
      if (copyGameBoard[i][columnIndex] == '-') {
        copyGameBoard[i][columnIndex] = playerSymbol;
        this.setState({gameBoard: copyGameBoard});
        this.checkIfWinner(i, columnIndex)
        break
      };
    }
  }

  createRow(row, i) {
    const {winner} = this.state;

    return row.map((elem, i2) => {
      let spotClass = '';
      if (elem == 'X') {
        spotClass = 'player-1-dot';
      } else if (elem == 'O') {
        spotClass = 'player-2-dot';
      } else {
        spotClass = 'empty';
      }
      return (
        <div 
          className={"spot " + spotClass} 
          data-coordinate={'[' + i + ',' + i2 + ']'}
          onClick={!winner ? (e) => this.clickSpot(e) : null}
        >
        </div>
      )
    })
  }

  resetGame() {
    this.setState({
      gameBoard: this.createGame(7, 6),
      playerTurn: 'Player One',
      winner: false
    })
  }

  // FUNCTIONS FOR CHECKING WINNER

  checkHorizontal(rowIndex, columnIndex) {
    const {gameBoard, playerTurn} = this.state;
    let nextPlayer = playerTurn == 'Player One' ? 'Player Two' : 'Player One';
    let playerSymbol = playerTurn == 'Player One' ? 'X' : 'O';
    let count = 1;

    for (var right = columnIndex + 1; right < gameBoard[0].length; right++) {
      if (gameBoard[rowIndex][right] == playerSymbol) {
        count += 1;
      } else if (gameBoard[rowIndex][right] != playerSymbol) {
        break
      }
    }

    for (var left = columnIndex - 1; left >= 0; left--) {
      if (gameBoard[rowIndex][left] == playerSymbol) {
        count += 1;
      } else if (gameBoard[rowIndex][left] != playerSymbol) {
        break
      }
    }

    return count == 4
  }

  checkVertical(rowIndex, colIndex) {
    const {gameBoard, playerTurn} = this.state;
    let nextPlayer = playerTurn == 'Player One' ? 'Player Two' : 'Player One';
    let playerSymbol = playerTurn == 'Player One' ? 'X' : 'O';
    let count = 1;

    for (var down = rowIndex + 1; down < gameBoard.length; down++) {
      if (gameBoard[down][colIndex] == playerSymbol) {
        count += 1;
      } else if (gameBoard[rowIndex][down] != playerSymbol) {
        break
      }
    }

    for (var up = rowIndex - 1; up >= 0; up--) {
      if (gameBoard[up][colIndex] == playerSymbol) {
        count += 1;
      } else if (gameBoard[rowIndex][up] != playerSymbol) {
        break
      }
    }

    return count == 4
  }

  checkTopRightToBotLeftDiagnol(rowIndex, colIndex) {
    const {gameBoard, playerTurn} = this.state;
    let nextPlayer = playerTurn == 'Player One' ? 'Player Two' : 'Player One';
    let playerSymbol = playerTurn == 'Player One' ? 'X' : 'O';
    let count = 1;

    let up, left;
    for (up = rowIndex - 1, left = colIndex - 1; (up >= 0) && (left < gameBoard[0].length); up--, left--) {
      if (gameBoard[up][left] == playerSymbol) {
        count += 1;
      } else if (gameBoard[up][left] != playerSymbol) {
        break
      }
    }

    let down, right;
    for (down = rowIndex + 1, right = colIndex + 1; (down < gameBoard.length) && (right >= 0); down++, right++) {
      if (gameBoard[down][right] == playerSymbol) {
        count += 1;
      } else if (gameBoard[down][right] != playerSymbol) {
        break
      }
    }

    return count == 4
  }

  checkBotLeftToTopRightDiagnol(rowIndex, colIndex) {
    const {gameBoard, playerTurn} = this.state;
    let nextPlayer = playerTurn == 'Player One' ? 'Player Two' : 'Player One';
    let playerSymbol = playerTurn == 'Player One' ? 'X' : 'O';
    let count = 1;

    let up, right;
    for (up = rowIndex - 1, right = colIndex + 1; (up >= 0) && (right < gameBoard[0].length); up--, right++) {
      if (gameBoard[up][right] == playerSymbol) {
        count += 1;
      } else if (gameBoard[up][right] != playerSymbol) {
        break
      }
    }

    let down, left;
    for (down = rowIndex + 1, left = colIndex - 1; (down < gameBoard.length) && (left >= 0); down++, left--) {
      if (gameBoard[down][left] == playerSymbol) {
        count += 1;
      } else if (gameBoard[down][left] != playerSymbol) {
        break
      }
    }

    return count == 4
  }

  checkTieGame() {
    const {gameBoard} = this.state;

    for(var i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i].includes('-')) {
        return false
      }
    }

    return true
  }

  checkIfWinner(rowIndex, colIndex) {
    const {playerTurn, score} = this.state;
    let nextPlayer = playerTurn == 'Player One' ? 'Player Two' : 'Player One';

    if (
      this.checkVertical(rowIndex, colIndex) || 
      this.checkHorizontal(rowIndex, colIndex) ||
      this.checkTopRightToBotLeftDiagnol(rowIndex, colIndex) ||
      this.checkBotLeftToTopRightDiagnol(rowIndex, colIndex)) {

      let copyScore = Object.assign({}, score);
      copyScore[playerTurn] += 1
      this.setState({winner: true, score: copyScore})
    } else if (this.checkTieGame()) {
      this.setState({tie: true})
    } else {
      this.setState({playerTurn: nextPlayer})
    }
  }

  render() {
    const {playerTurn, winner, score, tie} = this.state;
    let headerClass = playerTurn == 'Player One' ? 'player-one' : 'player-two';

    return (
      <div className="game-container">
        <h1 className={headerClass}>{winner ? `${playerTurn} has won!` : playerTurn}</h1>
        <h1>{tie ? "TIE GAME" : null}</h1>
        <div className="board">
          {this.displayGame()}
        </div>
        <div className="score">
          <p className="red">Player One: {score['Player One']}</p>
          <p className="blue">Player Two: {score['Player Two']}</p>
          <div className="new-game-btn" onClick={this.resetGame}>New Game</div>
        </div>
      </div>
    )
  }
}