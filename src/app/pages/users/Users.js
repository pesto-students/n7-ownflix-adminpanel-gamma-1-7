import moment from 'moment';
import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import LoaderContext from '../../context/LoaderContext';
import axios from './../../utils/axios-default';

export class Resignations extends Component {
	// const { dark, toggle } =
	static contextType = LoaderContext;

	constructor(props) {
		super(props);
		this.state = {
			deletableId: '',
			deleteModalShow: false,
			statusModalShow: false,
			statusUpdateId: '',
			statusValue: false,
			data: [],
		};
		// this.handleDeleteModalClose = this.handleDeleteModalClose.bind(this);
	}

	componentDidMount() {
		axios.get('/users/').then(result => {
			this.setState({
				data: result.data,
			});
		});
	}
	handleDeleteModalClose() {
		this.setState({ deleteModalShow: false, deletableId: '' });
	}
	handleDeleteModal(id) {
		this.setState({ deleteModalShow: true, deletableId: id });
	}
	handleDelete() {
		this.context.loadingText('Processing');
		this.context.toggleLoader(true);
		axios.delete('/users/' + this.state.deletableId)
			.then(res => {
				alert('Deleted successfuly');
				this.handleDeleteModalClose();
				this.componentDidMount();
			})
			.catch(() => {
				alert('Something went wrong');
			})
			.finally(e => {
				this.context.toggleLoader(false);
			});
	}

	handleStatusModal(id) {
		// console.log(id);
		this.setState({ statusModalShow: true, statusUpdateId: id });
	}

	handleStatusModalClose() {
		// console.log('close modal');
		this.setState({ statusModalShow: false, statusUpdateId: 'id' });
	}
	handleUserStatusFormSubmit(e) {
		e.preventDefault();
		this.context.loadingText('Processing');
		this.context.toggleLoader(true);
		axios.patch('/users/' + this.state.statusUpdateId, { active: this.state.statusValue })
			.then(res => {
				// console.log(res.data);
				alert('Updated successfuly');
				this.handleStatusModalClose();
				this.componentDidMount();
			})
			.catch(() => {
				alert('Something went wrong');
			})
			.finally(e => {
				this.context.toggleLoader(false);
			});
	}

	render() {
		return (
			<>
				<Helmet defer={false}>
					<title>Users - {process.env.REACT_APP_NAME}</title>
				</Helmet>
				<div className="container">
					<div className="col-lg-12 grid-margin stretch-card">
						<div className="card">
							<div className="card-body">
								<h4 className="card-title clearFixx">
									<div>Users</div>
									<div className="linkNew">
										<Link
											to="/users/create"
											className="btn btn-primary"
										>
											+ Add New
										</Link>
									</div>
								</h4>

								<div className="table-responsive">
									<table className="table table-striped table-hover">
										<thead>
											<tr>
												<th> # </th>
												<th> Date & Time </th>
												<th> Name </th>
												<th> Role </th>
												<th> Email </th>
												<th> Verified </th>
												<th> Status </th>
												<th> Action </th>
												<th> Delete </th>
											</tr>
										</thead>
										<tbody>
											{this.state.data.map(
												(item, index) => {
													return (
														item.role !==
															'Admin' && (
															<tr
																key={
																	item._id
																}
															>
																<td>
																	{index +
																		1}
																</td>
																<td>
																	{moment(
																		item.createdAt
																	).format(
																		'DD-MMM-YYYY hh:mm A '
																	)}
																</td>
																<td>
																	{
																		item.name
																	}
																</td>
																<td>
																	{
																		item.role
																	}
																</td>
																<td>
																	{
																		item.email
																	}
																</td>
																<td>
																	{item.isVerified
																		? 'Verified'
																		: 'Not Verified'}
																</td>
																<td>
																	{item.active
																		? 'Active'
																		: 'Disabled'}
																</td>
																<td>
																	<button
																		onClick={e =>
																			this.handleStatusModal(
																				item._id
																			)
																		}
																		className="btn btn-secondary"
																	>
																		Change
																		Status
																	</button>
																</td>
																<td>
																	<button
																		onClick={e =>
																			this.handleDeleteModal(
																				item._id
																			)
																		}
																		className="btn btn-danger"
																	>
																		Delete
																	</button>
																</td>
															</tr>
														)
													);
												}
											)}
										</tbody>
									</table>
									{/* modal */}
									<div>
										<Modal
											show={
												this.state
													.deleteModalShow
											}
											onHide={e =>
												this.handleDeleteModalClose()
											}
										>
											<Modal.Header closeButton>
												<Modal.Title>
													Confirmation
												</Modal.Title>
											</Modal.Header>
											<Modal.Body>
												<h5>
													Are you sure to
													delete this?
												</h5>
												<div
													style={{
														float: 'right',
													}}
												>
													<Button
														className="btn btn-secondary m-2"
														onClick={e =>
															this.handleDeleteModalClose()
														}
													>
														Cancel
													</Button>
													<Button
														className="btn btn-danger"
														onClick={e =>
															this.handleDelete()
														}
													>
														Delete
													</Button>
												</div>
											</Modal.Body>
										</Modal>
									</div>

									<div>
										<Modal
											show={
												this.state
													.statusModalShow
											}
											onHide={e =>
												this.handleStatusModalClose()
											}
										>
											<Modal.Header closeButton>
												<Modal.Title>
													User Status
												</Modal.Title>
											</Modal.Header>
											<Modal.Body>
												<Form
													onSubmit={e =>
														this.handleUserStatusFormSubmit(
															e
														)
													}
												>
													<div className="form-group">
														<label>
															Status
														</label>
														<select
															name="status"
															className="form-control"
															value={
																this
																	.statusValue
															}
															onChange={e =>
																this.setState(
																	{
																		statusValue:
																			e
																				.target
																				.value,
																	}
																)
															}
														>
															<option value="">
																--choose--
															</option>
															<option value="true">
																Active
															</option>
															<option value="false">
																Disable
															</option>
														</select>
													</div>

													<div className="form-group">
														<Button
															variant="secondary"
															onClick={e =>
																this.handleStatusModalClose()
															}
														>
															Close
														</Button>
														<Button
															type="submit"
															variant="primary"
															style={{
																float: 'right',
															}}
														>
															Save
															Changes
														</Button>
													</div>
												</Form>
											</Modal.Body>
										</Modal>
									</div>

									{/* modal */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default Resignations;
