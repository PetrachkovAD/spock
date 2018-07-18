import React, {Component} from 'react';
import { Button } from 'reactstrap';
import * as audio from '../../audio';

class Gesture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enable: this.props.enable === undefined ? true : this.props.enable,
      isFull: this.props.gesture === undefined ? false : true,
      isMy: this.props.isMy === undefined ? true : this.props.isMy
    };
    // Пробросим родителю выбранный жест
    this.select = this.select.bind(this);
  }

  select() {
    if(this.state.enable && this.state.isFull && this.props.onSelectGesture) {
      audio.play("click");
      this.props.onSelectGesture(this.props.gesture);
    }
  }

  render() {
    var image = (
      <div style={{width: '100px', height: '100px'}}></div>
    );

    if(this.props.gesture) {
      image = (
        <img  
          src = {this.props.gesture.image}
          alt = {this.props.gesture.name}
        />
      )
    }

    return (
      <Button
        onClick={this.select}
        color={this.state.isMy ? "success" : "danger"}
        className={this.state.enable ? undefined : "disabled"}
        outline
      >
        {image}
      </Button>
    )
  }
}

export default Gesture;