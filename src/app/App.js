import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './App.scss';
import AppRoutes from './AppRoutes';
import { LoaderProvider } from './context/LoaderContext';
import { UserProvider } from './context/UserContext';
import Footer from './pages/shared/Footer';
import Navbar from './pages/shared/Navbar';
import Sidebar from './pages/shared/Sidebar';
import store from './redux/store';
import axios from './utils/axios-default';

class App extends Component {
	state = {};
	componentDidMount() {
		this.onRouteChanged();
	}
	render() {
		let navbarComponent = !this.state.isFullPageLayout ? <Navbar /> : '';
		let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar /> : '';

		let footerComponent = !this.state.isFullPageLayout ? <Footer /> : '';
		return (
			<LoaderProvider>
				<div className="container-scroller">
					<UserProvider>
						<Provider store={store}>
							{navbarComponent}
							<div className="container-fluid page-body-wrapper">
								{sidebarComponent}
								<div className="main-panel">
									<div className="content-wrapper ">
										<AppRoutes />
									</div>
									{footerComponent}
								</div>
							</div>
						</Provider>
					</UserProvider>
				</div>
			</LoaderProvider>
		);
	}

	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			this.onRouteChanged();
		}
	}

	async onRouteChanged() {
		console.log('ROUTE CHANGED');
		// console.log(localStorage)

		// const body = document.querySelector('body');
		window.scrollTo(0, 0);
		const fullPageLayoutRoutes = ['/login', '/logout', '/new-entry'];
		for (let i = 0; i < fullPageLayoutRoutes.length; i++) {
			if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
				this.setState({
					isFullPageLayout: true,
				});
				document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
				break;
			} else {
				this.setState({
					isFullPageLayout: false,
				});
				document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
			}
		}
		if (localStorage.getItem('accessToken')) {
			await axios
				.get('/auth/check')
				.then(async res => {
					if (res.data.msg === 'Expired') {
						localStorage.clear();
						if (this.props.location.pathname !== '/login') {
							window.location.href = process.env.REACT_APP_URL + '/login';
						}
					}
				})
				.catch(e => {
					localStorage.clear();
					if (this.props.location.pathname !== '/login') {
						window.location.href = process.env.REACT_APP_URL + '/login';
					}
				});
		} else {
			if (this.props.location.pathname === '/new-entry') {
				// return true;
			} else if (this.props.location.pathname !== '/login') {
				window.location.href = process.env.REACT_APP_URL + '/login';
			}
		}
	}
}

export default withRouter(App);
