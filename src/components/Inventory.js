import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component {

	constructor() {
		super();
		this.renderInventory = this.renderInventory.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.renderLogin = this.renderLogin.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.authHandler = this.authHandler.bind(this);
		this.logout = this.logout.bind(this);
		this.state = {
			uid : null,
			owner : null
		}
	}


	componentDidMount() {
		base.onAuth((user)=>{
			if (user) {
				this.authHandler(null, {user});
			}
		});
	}

	logout() {
		base.unauth();
		this.setState({
			uid: null
		});
	}

	authenticate(provider) {
		base.authWithOAuthPopup(provider, this.authHandler);
	}

	authHandler(err, authData) {
		console.log(authData);
		if (err) {
			console.log(err);
		}

		//grab the store info
		const storeRef = base.database().ref(this.props.storeId);

		//query the db for store data
		storeRef.once('value', (snapshot)=>{
			const data = snapshot.val() || {};

			//claim as owner if theres none
			if (!data.owner) {
				storeRef.set({
					owner : authData.user.uid
				});
			}

			this.setState({
				uid : authData.user.uid,
				owner: data.owner || authData.user.uid
			});
		});
	}


	renderLogin() {
		return (
			<div className="login">
				<h2>Inventory</h2>
				<p>Sign in to manage the inventory</p>
				<button 
					className="facebook" 
					onClick={() => this.authenticate('facebook')}
					>Login with FB</button>
				<button 
					className="twitter"
					 onClick={() => this.authenticate('twitter')}
					 >Login with twitter</button>
			</div>
		)
	}


	handleChange(e, key) {
		const fish = this.props.fishes[key];
		//take copy of a state
		const updatedFish = {
			...fish,
			[e.target.name] : e.target.value
		};
		
		this.props.updateFish(key, updatedFish);
	}

	renderInventory(key) {
		const fish = this.props.fishes[key];
		return (
			<div className="fish-edit" key={key}>
				<input type="text" name="name" onChange={(e) => this.handleChange(e, key)} value={fish.name} placeholder="Fish Name" />
				<input type="text" name="price"  onChange={(e) => this.handleChange(e, key)} value={fish.price} placeholder="Fish Price" />
				<select name="status"  onChange={(e) => this.handleChange(e, key)} value={fish.status}>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea name="desc"  onChange={(e) => this.handleChange(e, key)} value={fish.desc} placeholder="Fish Desc"></textarea>
				<input name="image"  onChange={(e) => this.handleChange(e, key)} value={fish.image} type="text" placeholder="Fish Image" />
				<button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
			</div>
		)
	}


	render() {
		const logout = <button onClick={this.logout}>Log out</button>;
		//check if logged in
		if (!this.state.uid) {
			return <div>{this.renderLogin()}</div>
		}

		//check if owner of this store
		if (this.state.uid !== this.state.owner) {
			return (
				<div>
					<p>Sorry, you're not the owner of this store</p>
					{logout}
				</div>
			)
		}

		return (
			<div>
				{logout}
				<h2>Inventory</h2>
				{Object.keys(this.props.fishes).map(this.renderInventory)}
				<AddFishForm addFish={this.props.addFish} />
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
		)
	}
}

export default Inventory;