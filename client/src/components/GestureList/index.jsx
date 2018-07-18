import React, {Component} from 'react';
import Gesture from '../Gesture'

class GestureList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			enable: this.props.enable === undefined ? true : this.props.enable,
			isMy: this.props.isMy === undefined ? true : this.props.isMy
		};
	}

	render() {
		const gestureElements = this.props.gestures.map(gesture => 
			<li key = {gesture.name} style={{ padding: '4px' }}>
				<Gesture
					gesture={gesture}
					enable={this.state.enable}
					isMy={this.state.isMy}
					onSelectGesture={this.props.onSelectGesture}
					/>
			</li>
		);

		return (
			<ul className="list-unstyled" style={{ textAlign: 'center' }}>
				{gestureElements}
			</ul>
		);
	}
}

export default GestureList;