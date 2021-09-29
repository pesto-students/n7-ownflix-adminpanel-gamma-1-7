import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import axios from '../../utils/axios-default';
import StatusCard from '../../hoc/StatusCard';
export class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dashboard: [],
		};
	}

	componentDidMount() {
		axios.get('/dashboard')
			.then(res => {
				// console.log(res.data);
				this.setState({ dashboard: res.data });
			})
			.catch(err => {
				console.log(err);
			});
	}

	render() {
		return (
			<div>
				<Helmet defer={false}>
					<title>Dashboard - {process.env.REACT_APP_NAME}</title>
				</Helmet>
				<div className="row page-title-header">
					<div className="col-12">
						<div className="page-header">
							<h4 className="page-title">Dashboard</h4>
						</div>
						<div className="row">
							{this.state.dashboard.map((item, index) => (
								<StatusCard
									key={index}
									col={'col-3'}
									count={item.count}
									title={item.title}
								/>
							))}
						</div>
					</div>
				</div>
				<div className="row"></div>
			</div>
		);
	}
}
export default Dashboard;
