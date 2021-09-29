import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet';
import LoaderContext from '../../context/LoaderContext';
import axios from '../../utils/axios-default';

export default function GenreCreateOrEdit(props) {
	const [title, setTitle] = useState('');

	const [isLoading, setLoading] = useState(false);
	const useLoaderContext = useContext(LoaderContext);

	const handleSubmitForm = e => {
		e.preventDefault();
		useLoaderContext.loadingText('Processing');
		useLoaderContext.toggleLoader(true);
		setLoading(true);
		axios.post('genres/', {
			title,
		})
			.then(res => {
				alert('Saved successfully');
				window.location.href = process.env.REACT_APP_URL + '/genres';
			})
			.catch(err => {
				console.log(err);
			})
			.finally(e => {
				useLoaderContext.toggleLoader(false);
				blankInputs();
				setLoading(false);
			});
	};
	const blankInputs = () => {};

	useEffect(() => {}, []);

	return (
		<>
			<Helmet defer={false}>
				<title>New Genre - {process.env.REACT_APP_NAME}</title>
			</Helmet>
			<div className="">
				<div className="container">
					<div>
						<div className="row">
							<div className="col-lg-12 grid-margin stretch-card">
								<div className="card">
									<div className="card-body">
										<h4 className="card-title bg-light clearfix ">
											New Genre
										</h4>
										<div>
											<Form
												onSubmit={
													handleSubmitForm
												}
											>
												<Form.Group
													className="col-12"
													controlId="formBasicEmail"
												>
													<Form.Label>
														Title
													</Form.Label>
													<Form.Control
														type="text"
														placeholder="Enter name"
														value={
															title
														}
														onChange={e =>
															setTitle(
																e
																	.target
																	.value
															)
														}
														required={
															true
														}
													/>
												</Form.Group>

												<Form.Group
													style={{
														float: 'right',
													}}
												>
													<Button
														variant="primary"
														type="submit"
													>
														{isLoading
															? 'Loading…'
															: 'Submit'}
													</Button>
												</Form.Group>
											</Form>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
