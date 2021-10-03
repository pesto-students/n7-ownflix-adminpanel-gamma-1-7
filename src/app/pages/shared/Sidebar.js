import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import { Link, withRouter } from 'react-router-dom';
import UserContext from './../../context/UserContext';

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	static contextType = UserContext;
	toggleMenuState(menuState) {
		if (this.state[menuState]) {
			this.setState({ [menuState]: false });
		} else if (Object.keys(this.state).length === 0) {
			this.setState({ [menuState]: true });
		} else {
			Object.keys(this.state).forEach(i => {
				this.setState({ [i]: false });
			});
			this.setState({ [menuState]: true });
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			this.onRouteChanged();
		}
	}

	onRouteChanged() {
		document.querySelector('#sidebar').classList.remove('active');
		Object.keys(this.state).forEach(i => {
			this.setState({ [i]: false });
		});

		const dropdownPaths = [
			{ path: '/apps', state: 'appsMenuOpen' },
			{ path: '/basic-ui', state: 'basicUiMenuOpen' },
		];

		dropdownPaths.forEach(obj => {
			if (this.isPathActive(obj.path)) {
				this.setState({ [obj.state]: true });
			}
		});
	}
	render() {
		return (
			<nav className="sidebar sidebar-offcanvas" id="sidebar">
				<div className="text-center sidebar-brand-wrapper d-flex align-items-center">
					<a className="sidebar-brand brand-logo" href={'!#'}>
						<div style={{ color: 'white', fontSize: 30 }}>WatchFlix</div>
					</a>
					<a className="sidebar-brand brand-logo-mini pt-3" href={'!#'}>
						<div style={{ color: 'white', fontSize: 16 }}>WatchFlix</div>
					</a>
					<div className="bk-arrow clickToClose">
						<i className="mdi mdi-arrow-left"></i>
					</div>
				</div>
				<ul className="nav">
					<li className="nav-item nav-profile not-navigation-link">
						<div className="nav-link">
							<Dropdown>
								<Dropdown.Toggle className="nav-link user-switch-dropdown-toggler p-0 toggle-arrow-hide bg-transparent border-0 w-100">
									<div className="d-flex justify-content-between align-items-start">
										<div className="profile-image">
											<img
												className="img-xs rounded-circle"
												src={
													'https://img.icons8.com/bubbles/50/000000/user.png'
												}
												alt="profile"
											/>
											<div className="dot-indicator bg-success"></div>
										</div>
										<div className="text-wrapper">
											<p className="profile-name">
												{this.context.name}
											</p>
											<p className="designation">
												{this.context.role}
											</p>
										</div>
									</div>
								</Dropdown.Toggle>
							</Dropdown>
						</div>
					</li>

					<li
						className={
							this.isPathActive('/dashboard') ? 'nav-item active' : 'nav-item'
						}
					>
						<Link className="nav-link" to="/dashboard">
							<i className="mdi mdi-television menu-icon"></i>
							<span className="menu-title">
								<Trans>Dashboard</Trans>
							</span>
						</Link>
					</li>

					<li className={this.isPathActive('/users') ? 'nav-item active' : 'nav-item'}>
						<Link className="nav-link" to="/users">
							<i className="mdi mdi-account-multiple menu-icon"></i>
							<span className="menu-title">
								<Trans>Users</Trans>
							</span>
						</Link>
					</li>
					<li className={this.isPathActive('/genres') ? 'nav-item active' : 'nav-item'}>
						<Link className="nav-link" to="/genres">
							<i className="mdi mdi-sim-alert menu-icon"></i>
							<span className="menu-title">
								<Trans>Genres</Trans>
							</span>
						</Link>
					</li>

					<li className={this.isPathActive('/movies') ? 'nav-item active' : 'nav-item'}>
						<Link className="nav-link" to="/movies">
							<i className="mdi mdi-sim-alert menu-icon"></i>
							<span className="menu-title">
								<Trans>Movies</Trans>
							</span>
						</Link>
					</li>

					<li className={this.isPathActive('/series') ? 'nav-item active' : 'nav-item'}>
						<Link className="nav-link" to="/series">
							<i className="mdi mdi-sim-alert menu-icon"></i>
							<span className="menu-title">
								<Trans>Series</Trans>
							</span>
						</Link>
					</li>

					<li
						className={
							this.isPathActive('/subscriptions')
								? 'nav-item active'
								: 'nav-item'
						}
					>
						<Link className="nav-link" to="/subscriptions">
							<i className="mdi mdi-sim-alert menu-icon"></i>
							<span className="menu-title">
								<Trans>Subscriptions</Trans>
							</span>
						</Link>
					</li>
				</ul>
			</nav>
		);
	}

	isPathActive(path) {
		return this.props.location.pathname.startsWith(path);
	}

	componentDidMount() {
		this.onRouteChanged();
		// add className 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
		const body = document.querySelector('body');
		document.querySelectorAll('.sidebar .nav-item').forEach(el => {
			el.addEventListener('mouseover', function () {
				if (body.classList.contains('sidebar-icon-only')) {
					el.classList.add('hover-open');
				}
			});
			el.addEventListener('mouseout', function () {
				if (body.classList.contains('sidebar-icon-only')) {
					el.classList.remove('hover-open');
				}
			});
		});
	}
}

export default withRouter(Sidebar);
