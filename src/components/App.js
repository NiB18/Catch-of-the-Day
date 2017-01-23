import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import base from '../base';

import sampleFishes from '../sample-fishes.js';

class App extends React.Component {
	
	constructor() {
		super();
		
		this.addFish = this.addFish.bind(this);
		this.removeFish = this.removeFish.bind(this);
		this.updateFish = this.updateFish.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
		this.removeFromOrder = this.removeFromOrder.bind(this);
		this.loadSamples = this.loadSamples.bind(this);
		
		this.state = {
			fishes: {},
			order : {}
		}
	}


	componentWillMount() {
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
			context: this,
			state: 'fishes'
		});
		
		/* localStorage orders */
		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
		if (localStorageRef) {
			const order = JSON.parse(localStorageRef);
			this.setState({order});
		}
	}


	componentWillUnmount() {
		base.removeBinding(this.ref);
	}
	
	
	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
	}


	removeFish(key) {
		const fishes = {...this.state.fishes};
		fishes[key] = null;
		this.setState({fishes});
	}
	
	updateFish(key, updatedFish) {
		const fishes = {...this.state.fishes};
		fishes[key] = updatedFish;
		this.setState({
			fishes
		});
	}
	
	addFish(fish) {
		//take a copy of current state
		const fishes = {...this.fishes};
		//add in a new fish
		const timestamp = Date.now();
		fishes[`fish-${timestamp}`] = fish;
		//set state
		//this.setState({ fishes : fishes});
		this.setState({fishes});
	}
	
	removeFromOrder(key) {
		const order = {...this.state.order};
		order[key]--;
		if ( order[key] < 1 ) {
			delete order[key];
		}

		this.setState({ order })
	}
	
	addToOrder(key) {
		//take a copy of state
		const order = {...this.state.order};
		order[key] = order[key] + 1 || 1;
		
		this.setState({order});
	}
	
	
	loadSamples() {
		this.setState({
			fishes: sampleFishes
		});
	}
	
	render() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh seafood market" />
					<ul className="list-of-fishes">
						{
							Object
								.keys(this.state.fishes)
								.map( key => <Fish addToOrder={this.addToOrder} key={key} index={key} details={this.state.fishes[key]} />)
						}
					</ul>
				</div>
				<Order 
					fishes={this.state.fishes} 
					order={this.state.order}
					params={this.props.params}
					removeFromOrder={this.removeFromOrder} />
				<Inventory 
					loadSamples={this.loadSamples} 
					addFish={this.addFish} 
					fishes={this.state.fishes}
					updateFish={this.updateFish}
					removeFish={this.removeFish}
					storeId={this.props.params.storeId} />
			</div>
		)
	}
}

export default App;