import React from 'react';
import {getFunName} from '../helpers';

class StorePicker extends React.Component {
	
	goToStore(e) {
		e.preventDefault();
		this.context.router.transitionTo(`/store/${this.storeInput.value}`);
	}
	
	render() {
		return (
			<form action="" className="store-selector" onSubmit={this.goToStore.bind(this)}>
				{/* COMMENT */}
				<h2>Please Enter A Store</h2>
				<input type="text" required placeholder="Store Name" defaultValue={getFunName()} ref={(input)=>{this.storeInput = input;}} />
				<button type="submit">Visit Store &rarr;</button>
			</form>

		);
	}
}

StorePicker.contextTypes = {
	router : React.PropTypes.object 
}


export default StorePicker;