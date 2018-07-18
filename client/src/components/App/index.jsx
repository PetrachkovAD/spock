import React, {Component} from 'react';
import {subscribe, joinTo, step} from '../../api';
import GestureList from '../GestureList'
import Gesture from '../Gesture'
import WaitingScreen from '../WaitingScreen'
import gestures from '../../data'
import './style.css'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connectionId: null,
      gameId: null,
      isWinner: null,
      selectedGesture: undefined,
      enemyGesture: undefined
    };

    // В случае обрыва связи обновим страницу (попробуем получить новое соединение)
    this.failedConnection = this.failedConnection.bind(this);
    // Получим link для приглашения
    this.getConnectionId = this.getConnectionId.bind(this);
    // Получим id игры
    this.getGameId = this.getGameId.bind(this);
    // Получим результат матча
    this.getGameResult = this.getGameResult.bind(this);
    // Подпишемся на потерю соединения
    this.disconnect = this.disconnect.bind(this);
    // Получим выбранный жест
    this.selectGesture = this.selectGesture.bind(this);
    // Получим выбранные жест соперника
    this.getEnemyGesture = this.getEnemyGesture.bind(this);
  }

  failedConnection() {
    alert("Сonnection to the room failed");
    window.location.href = window.location.origin;
  }

  getEnemyGesture(name) {
    var self = this;

    gestures.forEach(function(item, i, arr) {
      if(item.name === name) {
        self.setState(
          (prevState) => ({
            enemyGesture: item
          })
        );
      }
    });
  }

  getConnectionId(connectionId) {
    this.setState(
      (prevState) => ({
        connectionId
      })
    );
  }

  getGameResult(res) {
    this.getEnemyGesture(res[this.state.connectionId].enemyStep);
    this.setState(
      (prevState) => ({
        isWinner: res[prevState.connectionId].isWin
      })
    );
  }

  disconnect() {
    this.failedConnection();
  }

  getGameId(gameId) {
    this.setState(
      (prevState) => ({
        gameId
      })
    );
  }

  selectGesture(gesture) {
    this.setState(
      (prevState) => ({
        selectedGesture: gesture
      })
    );
    step(
      this.state.gameId,
      gesture.name
    );
  }

  componentDidMount() {
    var search = window.location.search.slice(1);
    search = search ? JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') : {id: null};
    // Подпишемся на:
    //  Получения ссылки для приглашения.
    //  Получения ссылки на игру
    //  Результат матчи
    //  И обрыв соединения
    //
    subscribe(this.getConnectionId, this.getGameId, this.getGameResult, this.disconnect);
    // Если перешли по ссылке присоединимся к игре
    if(search.id) {
      joinTo(search.id);
    }
  }

  render() {
    var status;

    if(this.state.isWinner !== null) {
      if(this.state.isWinner) {
        status = (<div>Вы выиграли!</div>)
      }
      else {
        status = (<div>Сожалею ...</div>)
      }
    }

    return (
      <div className="container">
        {status}
        <WaitingScreen
          isOpen={!this.state.gameId}
          link={window.location.origin + '/?id=' + this.state.connectionId}/
        >
        <div className="row">
          <div className="col-sm-9">
            <div className="row">
              <div className="col-sm">
                <GestureList
                  enable={!this.state.selectedGesture}
                  gestures={gestures}
                  onSelectGesture={this.selectGesture}
                />
              </div>
              <div className="col-sm flex">
                <Gesture enable={false} gesture={this.state.selectedGesture}/>
              </div> 
              <div className="col-sm flex">
                <Gesture enable={false} isMy={false} gesture={this.state.enemyGesture} />
              </div> 
              <div className="col-sm">
                <GestureList
                  gestures={gestures}
                  enable={false}
                  isMy={false}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-3">  
          </div>
        </div>
      </div>
    )
  }
}

export default App