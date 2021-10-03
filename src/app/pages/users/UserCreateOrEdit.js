import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
// import Form from 'react-bootstrap/Form'
import { Helmet } from 'react-helmet';
import LoaderContext from '../../context/LoaderContext';
import axios from './../../utils/axios-default';

export default function ResignationCreate(props) {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [mobile, setMobile] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState('');
	const [isLoading, setLoading] = useState(false);
	const useLoaderContext = useContext(LoaderContext);

	const handleSubmitForm = e => {
		e.preventDefault();
		setLoading(true);
		useLoaderContext.loadingText('Processing');
		useLoaderContext.toggleLoader(true);
		axios.post('/users/', {
			name: name,
			email: email,
			password: password,
			role: role,
			mobile: mobile,
		})
			.then(res => {
				if (res.status === 201) {
					alert('User created successfully');
					props.history.push('/users');
				} else if (res.status === 200) {
					alert('User already exist');
				}
			})
			.catch(error => {
				console.log('error', error);
				alert('Something went wrong');
			})
			.finally(() => {
				setLoading(false);
				useLoaderContext.toggleLoader(false);
				// props.handleLoaderFromProp(false);
			});
		// createFolder(name,empId,email);
	};
	useEffect(() => {
		// console.log(role, password);
	}, []);

	return (
		<div>
			<Helmet defer={true}>
				<title>New User - {process.env.REACT_APP_NAME}</title>
			</Helmet>
			<div className="row">
				<div className="col-lg-12 grid-margin stretch-card">
					<div className="card">
						<div className="card-body">
							<h4 className="card-title bg-light clearfix">New User</h4>
							<div>
								<Form onSubmit={handleSubmitForm}>
									<Form.Group>
										<select
											name="status"
											className="form-control"
											onChange={e =>
												setRole(e.target.value)
											}
										>
											<option value="">
												--Choose--
											</option>
											<option value={'Admin'}>
												Admin
											</option>
											<option value={'User'}>
												User
											</option>
										</select>
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>Name</Form.Label>
										<Form.Control
											type="text"
											placeholder="Enter name"
											value={name}
											onChange={e =>
												setName(e.target.value)
											}
											required={true}
										/>
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>Email</Form.Label>
										<Form.Control
											type="email"
											placeholder="Enter email"
											value={email}
											onChange={e =>
												setEmail(e.target.value)
											}
											required={true}
										/>
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>Mobile</Form.Label>
										<Form.Control
											type="text"
											placeholder="Enter mobile"
											value={mobile}
											onChange={e =>
												setMobile(
													e.target.value
												)
											}
											minLength={10}
											maxLength={10}
											required={true}
										/>
									</Form.Group>

									<Form.Group className="mb-3">
										<Form.Label>Password</Form.Label>
										<Form.Control
											type="password"
											placeholder="Enter password"
											value={password}
											onChange={e =>
												setPassword(
													e.target.value
												)
											}
											required={true}
										/>
									</Form.Group>

									<Button variant="primary" type="submit">
										{isLoading ? 'Loading…' : 'Submit'}
									</Button>
								</Form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
