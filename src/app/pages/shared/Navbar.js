import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { login, logout } from '../../redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from '../../utils/axios-default';
import LoaderContext from '../../context/LoaderContext';

class Navbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			opened: false,

			oldEnterPassword: '',
			newPassword: '',
			confirmNewPassword: '',
			modalShow: false,
			errMsg: '',
		};
		this.toggleOffcanvas = this.toggleOffcanvas.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.handleModalClose = this.handleModalClose.bind(this);
		this.handleModalOpen = this.handleModalOpen.bind(this);
		this.handleSubmitPasswordForm = this.handleSubmitPasswordForm.bind(this);
	}
	static contextType = LoaderContext;
	handleLogout() {
		(async () => {
			this.props.logout();
			localStorage.clear();
			window.location.href = process.env.REACT_APP_URL + '/login';
		})();
	}
	toggleOffcanvas() {
		document.querySelector('.sidebar-offcanvas').classList.toggle('active');
		let isOpened = document.querySelector('#sidebar').classList.contains('active');
		if (isOpened) {
			this.setState({
				opened: true,
			});
		} else {
			this.setState({
				opened: false,
			});
		}
	}
	toggleRightSidebar() {
		document.querySelector('.right-sidebar').classList.toggle('open');
	}

	componentDidMount() {
		document.querySelector('.clickToClose').addEventListener('click', () => {
			if (this.state.opened) {
				this.toggleOffcanvas();
			}
		});
		document.querySelector('.content-wrapper').addEventListener('click', () => {
			if (this.state.opened) {
				this.toggleOffcanvas();
			}
		});
	}
	handleModalClose() {
		this.setState({ modalShow: false });
		this.setState({ oldEnterPassword: '', newPassword: '', confirmNewPassword: '' });
	}
	handleModalOpen() {
		this.setState({ modalShow: true });
	}

	handleSubmitPasswordForm(e) {
		e.preventDefault();
		this.context.loadingText('Processing');
		this.context.toggleLoader(true);
		if (this.state.newPassword.length < 8) {
			this.setState({ errMsg: 'Password should be minimum 8 characters' });
			return false;
		}
		if (this.state.newPassword === this.state.confirmNewPassword) {
			axios.put('/users/' + localStorage.getItem('user'), { password: this.state.newPassword })
				.then(res => {
					alert('Password changed successfully. Please login again');
					this.handleLogout();
					// this.setState({ errMsg: '' });
					// this.handleModalClose();
					// this.context.toggleLoader(false);
				})
				.catch(e => {
					this.setState({ errMsg: 'Something went wrong' });
					this.context.toggleLoader(false);
				});
		} else {
			this.setState({ errMsg: 'Password does not match' });
			this.context.toggleLoader(false);
			return false;
		}
	}

	render() {
		return (
			<nav className="navbar col-lg-12 col-12 p-lg-0 fixed-top d-flex flex-row">
				<div className="navbar-menu-wrapper d-flex align-items-center justify-content-between">
					<a
						className="navbar-brand brand-logo-mini align-self-center d-lg-none"
						href="!#"
						onClick={evt => evt.preventDefault()}
					></a>

					<button
						className="navbar-toggler navbar-toggler align-self-center"
						type="button"
						onClick={() => document.body.classList.toggle('sidebar-icon-only')}
					>
						<i className="mdi mdi-menu"></i>
					</button>
					<ul className="navbar-nav navbar-nav-right">
						<li className="nav-item  nav-profile border-0 pl-4">
							<Dropdown>
								{/* <Dropdown.Toggle className="nav-link count-indicator p-0 toggle-arrow-hide bg-transparent">
									<i className="mdi mdi-bell-outline"></i>
									<span className="count bg-success">4</span>
								</Dropdown.Toggle> */}
								{/* <Dropdown.Menu className="navbar-dropdown preview-list">
									<Dropdown.Item
										className="dropdown-item py-3 d-flex align-items-center"
										href="!#"
										onClick={evt => evt.preventDefault()}
									>
										<p className="mb-0 font-weight-medium float-left">
											<Trans>You have</Trans> 4{' '}
											<Trans>new notifications</Trans>{' '}
										</p>
										<span className="badge badge-pill badge-primary float-right">
											View all
										</span>
									</Dropdown.Item>
									<div className="dropdown-divider"></div>
									<Dropdown.Item
										className="dropdown-item preview-item d-flex align-items-center"
										href="!#"
										onClick={evt => evt.preventDefault()}
									>
										<div className="preview-thumbnail">
											<i className="mdi mdi-alert m-auto text-primary"></i>
										</div>
										<div className="preview-item-content py-2">
											<h6 className="preview-subject font-weight-normal text-dark mb-1">
												<Trans>
													Application
													Error
												</Trans>
											</h6>
											<p className="font-weight-light small-text mb-0">
												{' '}
												<Trans>
													Just now
												</Trans>{' '}
											</p>
										</div>
									</Dropdown.Item>
									<div className="dropdown-divider"></div>
									<Dropdown.Item
										className="dropdown-item preview-item d-flex align-items-center"
										href="!#"
										onClick={evt => evt.preventDefault()}
									>
										<div className="preview-thumbnail">
											<i className="mdi mdi-settings m-auto text-primary"></i>
										</div>
										<div className="preview-item-content py-2">
											<h6 className="preview-subject font-weight-normal text-dark mb-1">
												<Trans>Settings</Trans>
											</h6>
											<p className="font-weight-light small-text mb-0">
												{' '}
												<Trans>
													Private message
												</Trans>{' '}
											</p>
										</div>
									</Dropdown.Item>
									<div className="dropdown-divider"></div>
									<Dropdown.Item
										className="dropdown-item preview-item d-flex align-items-center"
										href="!#"
										onClick={evt => evt.preventDefault()}
									>
										<div className="preview-thumbnail">
											<i className="mdi mdi-airballoon m-auto text-primary"></i>
										</div>
										<div className="preview-item-content py-2">
											<h6 className="preview-subject font-weight-normal text-dark mb-1">
												<Trans>
													New user
													registration
												</Trans>
											</h6>
											<p className="font-weight-light small-text mb-0">
												{' '}
												2{' '}
												<Trans>
													days ago
												</Trans>{' '}
											</p>
										</div>
									</Dropdown.Item>
								</Dropdown.Menu>
							 */}
							</Dropdown>
						</li>
						{/* <li className="nav-item  nav-profile border-0">
							<Dropdown>
								<Dropdown.Toggle className="nav-link count-indicator p-0 toggle-arrow-hide bg-transparent">
									<i className="mdi mdi-email-outline"></i>
									<span className="count">7</span>
								</Dropdown.Toggle>
								<Dropdown.Menu className="navbar-dropdown preview-list">
									<Dropdown.Item
										className="dropdown-item  d-flex align-items-center"
										href="!#"
										onClick={evt => evt.preventDefault()}
									>
										<p className="mb-0 font-weight-medium float-left">
											<Trans>You have</Trans> 7{' '}
											<Trans>unread mails</Trans>{' '}
										</p>
										<span className="badge badge-pill badge-primary">
											View all
										</span>
									</Dropdown.Item>
									<div className="dropdown-divider"></div>
									<Dropdown.Item
										className="dropdown-item preview-item d-flex align-items-center"
										href="!#"
										onClick={evt => evt.preventDefault()}
									>
										<div className="preview-thumbnail">
											<img
												src={require('../../assets/images/faces/face10.jpg')}
												alt="profile"
												className="img-sm profile-pic"
											/>{' '}
										</div>
										<div className="preview-item-content flex-grow py-2">
											<p className="preview-subject ellipsis font-weight-medium text-dark">
												<Trans>
													Marian Garner
												</Trans>{' '}
											</p>
											<p className="font-weight-light small-text">
												{' '}
												<Trans>
													The meeting is
													cancelled
												</Trans>{' '}
											</p>
										</div>
									</Dropdown.Item>
									<div className="dropdown-divider"></div>
									<Dropdown.Item
										className="dropdown-item preview-item d-flex align-items-center"
										href="!#"
										onClick={evt => evt.preventDefault()}
									>
										<div className="preview-thumbnail">
											<img
												src={require('../../assets/images/faces/face12.jpg')}
												alt="profile"
												className="img-sm profile-pic"
											/>{' '}
										</div>
										<div className="preview-item-content flex-grow py-2">
											<p className="preview-subject ellipsis font-weight-medium text-dark">
												<Trans>
													David Grey
												</Trans>{' '}
											</p>
											<p className="font-weight-light small-text">
												{' '}
												<Trans>
													The meeting is
													cancelled
												</Trans>
											</p>
										</div>
									</Dropdown.Item>
									<div className="dropdown-divider"></div>
									<Dropdown.Item
										className="dropdown-item preview-item d-flex align-items-center"
										href="!#"
										onClick={evt => evt.preventDefault()}
									>
										<div className="preview-thumbnail">
											<img
												src={require('../../assets/images/faces/face1.jpg')}
												alt="profile"
												className="img-sm profile-pic"
											/>{' '}
										</div>
										<div className="preview-item-content flex-grow py-2">
											<p className="preview-subject ellipsis font-weight-medium text-dark">
												<Trans>
													Travis Jenkins
												</Trans>{' '}
											</p>
											<p className="font-weight-light small-text">
												{' '}
												<Trans>
													The meeting is
													cancelled
												</Trans>{' '}
											</p>
										</div>
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</li>

						
						
						 */}
						<li className="nav-item  nav-profile border-0">
							<Dropdown>
								<Dropdown.Toggle className="nav-link count-indicator bg-transparent">
									<img
										className="img-xs rounded-circle"
										src={
											'https://img.icons8.com/bubbles/50/000000/user.png'
										}
										alt="Profile"
									/>
								</Dropdown.Toggle>
								<Dropdown.Menu className="preview-list navbar-dropdown pb-3">
									<Dropdown.Item
										className="dropdown-item p-0 preview-item d-flex align-items-center border-bottom"
										href="!#"
										onClick={evt => evt.preventDefault()}
									></Dropdown.Item>
									<Dropdown.Item
										className="dropdown-item preview-item d-flex align-items-center border-0 mt-2"
										onClick={evt => evt.preventDefault()}
									>
										<Trans>My Accounts</Trans>
									</Dropdown.Item>
									<Dropdown.Item
										className="dropdown-item preview-item d-flex align-items-center border-0"
										onClick={this.handleModalOpen}
									>
										<Trans>Change Password</Trans>
									</Dropdown.Item>

									<Dropdown.Item
										className="dropdown-item preview-item d-flex align-items-center border-0"
										onClick={this.handleLogout}
									>
										<Trans>Log Out</Trans>
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</li>
					</ul>
					<button
						className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
						type="button"
						onClick={this.toggleOffcanvas}
					>
						<span className="mdi mdi-menu"></span>
					</button>
				</div>
				{/* password change modal */}
				<>
					<Modal show={this.state.modalShow} onHide={this.handleModalClose}>
						<Modal.Header closeButton>
							<Modal.Title>Change Password</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form onSubmit={this.handleSubmitPasswordForm}>
								<Form.Group className="mb-3" controlId="formBasicEmail">
									<Form.Label>New Password</Form.Label>
									<Form.Control
										type="password"
										placeholder="Enter new password"
										value={this.state.newPassword}
										onChange={e =>
											this.setState({
												newPassword:
													e.target.value,
											})
										}
										required={true}
									/>
								</Form.Group>
								<Form.Group className="mb-3" controlId="formBasicEmail">
									<Form.Label>Confirm Password</Form.Label>
									<Form.Control
										type="password"
										placeholder="Confirm new password"
										value={this.state.confirmNewPassword}
										onChange={e =>
											this.setState({
												confirmNewPassword:
													e.target.value,
											})
										}
										required={true}
									/>
									{this.state.errMsg.length > 0 && (
										<span style={{ color: 'red' }}>
											{this.state.errMsg}
										</span>
									)}
								</Form.Group>
								<Form.Group
									style={{
										float: 'right',
									}}
								>
									<Button
										variant="secondary"
										onClick={this.handleModalClose}
										style={{
											margin: 10,
										}}
									>
										Close
									</Button>
									<Button
										style={{
											margin: 10,
										}}
										variant="primary"
										type="submit"
									>
										Save Changes
									</Button>
								</Form.Group>
							</Form>
						</Modal.Body>
					</Modal>
				</>
				{/* password change modal */}
			</nav>
		);
	}
}

const mapStateToProps = state => {
	return {
		isLogin: state.isLogin,
	};
};
const mapDispatchToProps = dispatch => {
	return {
		login: () => dispatch(login()),
		logout: () => dispatch(logout()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
