import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

class WaitingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen} className={this.props.className}>
          <ModalHeader>Ожидание соперника</ModalHeader>
          <ModalBody style={{textAlign: 'center'}}>
            <img
              src="/image/rock-paper-scissors-lizard-spock.png"
              alt="rock paper scissors lizard spock"
            />
          </ModalBody>
          <ModalFooter>Отправте ссылку другому игроку {this.props.link}</ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default WaitingScreen;