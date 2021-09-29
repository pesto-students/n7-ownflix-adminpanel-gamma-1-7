import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { login, logout } from '../../redux';
import LoaderContext from '../../context/LoaderContext';

import axios from './../../utils/axios-default';
class Login extends Component {
	static contextType = LoaderContext;

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		};
		this.handleLogin = this.handleLogin.bind(this);
		this.handleForm = this.handleForm.bind(this);
	}

	handleForm(e) {
		this.setState({
			...this.state,
			[e.target.name]: e.target.value,
		});
	}
	static getDerivedStateFromProps(props, state) {
		if (props.isLogin) {
			window.location.href = process.env.REACT_APP_URL + '/dashboard';
		}
		return true;
	}

	handleLogin(e) {
		e.preventDefault();
		(async () => {
			this.context.loadingText('Processing');
			this.context.toggleLoader(true);
			axios.post('/auth/login', { email: this.state.email, password: this.state.password })
				.then(res => {
					// console.log(res.data.data.user);
					// if disabled
					if (res.data.data.user.role === 'Admin') {
						if (res.data.data.user.active) {
							localStorage.setItem('name', res.data.data.user.name);
							localStorage.setItem('role', res.data.data.user.role);
							localStorage.setItem('accessToken', res.data.data.accessToken);
							localStorage.setItem('user', res.data.data.user._id);
							this.props.login();
							setTimeout(() => {
								window.location.href =
									process.env.REACT_APP_URL + '/dashboard';
							}, 500);
						} else {
							alert('Your account has been disabled');
						}
					} else {
						alert('Unauthorized person');
					}
				})
				.catch(() => {
					alert('Check email and passowrd');
				})
				.finally(() => {
					// this.context.loadingText('Processing');
					this.context.toggleLoader(false);
				});

			// this.props.login();
			// window.localStorage.setItem('login', 'success');
			// this.props.history.push('/');
		})();
	}
	// componentDidMount()
	render() {
		return (
			<div>
				{!this.props.isLogin && (
					<div className="d-flex align-items-center auth px-0 login-background">
						<div className="row w-100 mx-0">
							<div className="col-lg-4 mx-auto">
								<div
									className="auth-form-light text-left"
									style={{
										padding: 25,
										borderRadius: 5,
										maxWidth: 400,
										margin: 'auto',
									}}
								>
									<h4>Hello WatchFlix</h4>
									{/* {console.log()} */}
									<Form
										className="pt-3"
										onSubmit={this.handleLogin}
									>
										<Form.Group className="d-flex search-field">
											<Form.Control
												type="email"
												placeholder="Email"
												size="lg"
												className="h-auto"
												value={this.state.email}
												onChange={
													this.handleForm
												}
												name="email"
												required
											/>
										</Form.Group>
										<Form.Group className="d-flex search-field">
											<Form.Control
												type="password"
												placeholder="Password"
												size="lg"
												className="h-auto"
												value={
													this.state
														.password
												}
												onChange={
													this.handleForm
												}
												name="password"
												required
											/>
										</Form.Group>
										<div className="mt-3">
											<Button
												type="submit"
												className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
											>
												SIGN IN
											</Button>
										</div>
										<div className="my-2 d-flex justify-content-between align-items-center">
											{/* <div className="form-check">
											<label className="form-check-label text-muted">
												<input
													type="checkbox"
													className="form-check-input"
												/>
												<i className="input-helper"></i>
												Keep me signed in
											</label>
										</div> */}
											{/* <a
											href="!#"
											onClick={event =>
												event.preventDefault()
											}
											className="auth-link text-black"
										>
											Forgot password?
										</a> */}
										</div>
									</Form>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
