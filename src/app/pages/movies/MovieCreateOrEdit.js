import React, { useContext, useEffect, useRef, useState } from 'react';
import S3 from 'react-aws-s3';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet';
import LoaderContext from '../../context/LoaderContext';
import { s3ForImages, s3ForImagesDelete, s3ForVideoSource } from '../../utils/aws-s3-config';
import axios from '../../utils/axios-default';
import slugify from 'react-slugify';

import Select from 'react-select';

export default function MovieCreateOrEdit(props) {
	const [dateArray, setDateArray] = useState([]);
	const [genreArray, setGenreArray] = useState([]);
	const [title, setTitle] = useState('');
	const [genre, setGenre] = useState([]);
	const [yearOfRelease, setYearOfRelease] = useState('');
	const [dateOfRelease, setDateOfRelease] = useState('');
	const [director, setDirector] = useState('');
	const [productionHouse, setProductionHouse] = useState('');
	const [imdbRating, setImdbRating] = useState('');
	const [duration, setDuration] = useState(0);
	const [actors, setActors] = useState('');
	const [plot, setPlot] = useState('');
	const [rated, setRated] = useState('');
	const [subscriptionRequired, setSubscriptionRequired] = useState('');

	// const [errorText, setErrorText] = useState('');
	const [isLoading, setLoading] = useState(false);
	const useLoaderContext = useContext(LoaderContext);

	const [images, setImages] = useState([]);
	const [videoTrailer, setvideoTrailer] = useState({});
	const [videoMain, setVideoMain] = useState({});
	const [imagesVertical, setImagesVertical] = useState([]);
	const fileInputImagesRef = useRef();
	const fileInputImagesVerticalRef = useRef();
	const fileInputVideoTrailerRef = useRef();
	const fileInputVideoMainRef = useRef();
	const formRef = useRef();

	const ReactS3ClientVideo = new S3(s3ForVideoSource('assets01'));
	const ReactS3Client = new S3(s3ForImages('assets01'));
	const ReactS3ClientDelete = new S3(s3ForImagesDelete());

	const handleSubmitForm = e => {
		e.preventDefault();
		setLoading(true);
		useLoaderContext.loadingText('Processing');
		useLoaderContext.toggleLoader(true);
		// console.log(formRef);
		let genres = genre.map(item => item.value);
		// console.log(genres);
		axios.post('movies/', {
			title,
			genres,
			yearOfRelease,
			dateOfRelease,
			director,
			productionHouse,
			imdbRating,
			duration,
			actors,
			plot,
			rated,
			subscriptionRequired,
			images,
			videoTrailer,
			videoMain,
			imagesVertical,
		})
			.then(res => {
				alert('Saved successfully');
				window.location.href = process.env.REACT_APP_URL + '/movies';
			})
			.catch(err => {
				console.log(err);
			})
			.finally(e => {
				useLoaderContext.toggleLoader(false);
				setLoading(false);
				blankInputs();
			});
	};

	const handleDeleteUploadedFile = e => {
		let file = e.target.getAttribute('file-location');
		console.log(file);
		let fileIndex = e.target.getAttribute('file-index');
		ReactS3ClientDelete.deleteFile(file)
			.then(response => {
				console.log(response);
				let fimages = images.filter(item => images.indexOf(item) !== fileIndex);
				setImages(fimages);
			})
			.catch(err => console.log(err));
	};

	const blankInputs = () => {};
	const uploadImages = e => {
		e.preventDefault();
		if (fileInputImagesRef.current.files.length !== 0) {
			let filesArray = fileInputImagesRef.current.files;
			const handleS3FileUpload = async file => {
				useLoaderContext.loadingText('Processing');
				useLoaderContext.toggleLoader(true);
				let newFileName = file.name.replace(/\..+$/, '');
				newFileName = slugify(newFileName);
				newFileName = parseInt(Math.random() * 10000000).toString() + '-' + newFileName;
				await ReactS3Client.uploadFile(file, newFileName).then(data => {
					if (data.status === 204) {
						let res = {
							location: {
								key: data.key,
								s3Url:
									'https://watchflix-image-bucket.s3.amazonaws.com/' +
									data.key,
								cloudFrontUrl:
									'https://d1kii9u1lzlye3.cloudfront.net/' +
									data.key,
							},
						};
						console.log(data);
						setImages(oldArray => [...oldArray, res]);
					} else {
						console.log('something went wrong');
					}
				});
				useLoaderContext.toggleLoader(false);
			};

			for (let i = 0; i < filesArray.length; i++) {
				handleS3FileUpload(filesArray[i]);
			}
		} else {
			alert('Please choose images to upload');
		}
		fileInputImagesRef.current.value = '';
	};
	const uploadVerticalImages = e => {
		e.preventDefault();
		if (fileInputImagesVerticalRef.current.files.length !== 0) {
			let filesArray = fileInputImagesVerticalRef.current.files;
			const handleS3FileUpload = async file => {
				useLoaderContext.loadingText('Processing');
				useLoaderContext.toggleLoader(true);
				let newFileName = file.name.replace(/\..+$/, '');
				newFileName = slugify(newFileName);
				newFileName = parseInt(Math.random() * 10000000).toString() + '-' + newFileName;
				await ReactS3Client.uploadFile(file, newFileName).then(data => {
					if (data.status === 204) {
						let res = {
							location: {
								s3Url:
									'https://watchflix-image-bucket.s3.amazonaws.com/' +
									data.key,
								cloudFrontUrl:
									'https://d1kii9u1lzlye3.cloudfront.net/' +
									data.key,
							},
						};
						setImagesVertical(oldArray => [...oldArray, res]);
					} else {
						console.log('something went wrong');
					}
				});
				useLoaderContext.toggleLoader(false);
			};

			for (let i = 0; i < filesArray.length; i++) {
				handleS3FileUpload(filesArray[i]);
			}
		} else {
			alert('Please choose posters to upload');
		}
		fileInputImagesVerticalRef.current.value = '';
	};
	const uploadVideoTrailer = e => {
		e.preventDefault();
		if (fileInputVideoTrailerRef.current.files.length !== 0) {
			let filesArray = fileInputVideoTrailerRef.current.files;
			const handleS3VideoUpload = file => {
				useLoaderContext.loadingText('Processing');
				useLoaderContext.toggleLoader(true);
				let newFileName = file.name.replace(/\..+$/, '');
				newFileName = parseInt(Math.random() * 10000000).toString() + '-' + newFileName;
				newFileName = slugify(newFileName);
				// console.log({ newFileName });
				let m3u8FileName = newFileName.split('.')[0] + '.m3u8';
				let dir = 'assets01/';
				let url = newFileName.split('.')[0] + '/AppleHLS1/' + m3u8FileName;
				let baseUrl =
					'https://new-media-stack-destination920a3c57-n2wymmftaxdd.s3.amazonaws.com/' +
					dir;

				var cfUrlSource = 'https://d2pmcqfenajpb2.cloudfront.net/';
				var cfUrlDest = 'https://d3dr7atq7iqw02.cloudfront.net/';

				ReactS3ClientVideo.uploadFile(file, newFileName).then(data => {
					let res = {
						sourceLocation: {
							bucket: data.bucket,
							key: data.key,
							location: {
								s3url: data.location,
								cloudFrontUrl: cfUrlSource + data.key,
							},
						},
						destinationLocation: {
							bucket: 'new-media-stack-destination920a3c57-n2wymmftaxdd',
							key: dir + url,
							location: {
								s3url: baseUrl + url,
								cloudFrontUrl: cfUrlDest + dir + url,
							},
						},
					};
					// console.log(res);

					if (data.status === 204) {
						// alert('success');
						console.log(res);
						setvideoTrailer(res);
					} else {
						alert('Video uploading failed');
					}
					useLoaderContext.toggleLoader(false);
				});
			};
			for (let i = 0; i < filesArray.length; i++) {
				handleS3VideoUpload(filesArray[i]);
			}
		} else {
			alert('Please choose video trailer to upload');
		}
		fileInputImagesVerticalRef.current.value = '';
	};

	const uploadVideoMain = e => {
		e.preventDefault();
		if (fileInputVideoMainRef.current.files.length !== 0) {
			let filesArray = fileInputVideoMainRef.current.files;
			const handleS3VideoUpload = file => {
				useLoaderContext.loadingText('Processing');
				useLoaderContext.toggleLoader(true);
				let newFileName = file.name.replace(/\..+$/, '');
				newFileName = parseInt(Math.random() * 10000000).toString() + '-' + newFileName;
				newFileName = slugify(newFileName);
				let m3u8FileName = newFileName.split('.')[0] + '.m3u8';
				let dir = 'assets01/';
				let url = newFileName.split('.')[0] + '/AppleHLS1/' + m3u8FileName;
				let baseUrl =
					'https://new-media-stack-destination920a3c57-n2wymmftaxdd.s3.amazonaws.com/' +
					dir;

				var cfUrlSource = 'https://d2pmcqfenajpb2.cloudfront.net/';
				var cfUrlDest = 'https://d3dr7atq7iqw02.cloudfront.net/';

				ReactS3ClientVideo.uploadFile(file, newFileName).then(data => {
					let res = {
						sourceLocation: {
							bucket: data.bucket,
							key: data.key,
							location: {
								s3url: data.location,
								cloudFrontUrl: cfUrlSource + data.key,
							},
						},
						destinationLocation: {
							bucket: 'new-media-stack-destination920a3c57-n2wymmftaxdd',
							key: dir + url,
							location: {
								s3url: baseUrl + url,
								cloudFrontUrl: cfUrlDest + dir + url,
							},
						},
					};
					// console.log(res);

					if (data.status === 204) {
						// alert('success');
						console.log(res);
						setVideoMain(res);
					} else {
						alert('Video uploading failed');
					}
					useLoaderContext.toggleLoader(false);
				});
			};
			for (let i = 0; i < filesArray.length; i++) {
				handleS3VideoUpload(filesArray[i]);
			}
		} else {
			alert('Please choose video to upload');
		}
		fileInputImagesVerticalRef.current.value = '';
	};

	const handleSelectChange = selectedOption => {
		setGenre([...selectedOption]);
		// console.log(`Option selected:`, selectedOption);
	};

	useEffect(() => {
		let arr = [];
		axios.get('/genres/all')
			.then(res => {
				res.data.map((item, index) => {
					arr.push({ value: item._id, label: item.title });
				});
			})
			.finally(e => {
				setGenreArray(arr);
			});
		for (let index = 1950; index < 2022; index++) {
			setDateArray(d => [...d, index]);
		}
	}, []);

	return (
		<>
			<Helmet defer={false}>
				<title>New Movie - {process.env.REACT_APP_NAME}</title>
			</Helmet>
			<div className="">
				<div className="container">
					<div>
						<div className="row">
							<div className="col-lg-12 grid-margin stretch-card">
								<div className="card">
									<div className="card-body">
										<h4 className="card-title bg-light clearfix ">
											New Movie
										</h4>
										<div>
											<Form
												onSubmit={
													handleSubmitForm
												}
												ref={formRef}
											>
												<Form.Group
													className="col-12"
													controlId="formBasicEmail"
												>
													<Form.Label>
														Movie
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
													className="col-12"
													controlId="formBasicEmail"
												>
													<Form.Label>
														Genres
													</Form.Label>

													<Select
														isMulti={
															true
														}
														value={
															genre
														}
														onChange={
															handleSelectChange
														}
														options={
															genreArray
														}
													/>
												</Form.Group>

												<div className="col-md-12">
													<div className="row">
														<div className="col-md-8">
															<Form.Group controlId="formBasicEmail">
																<Form.Label>
																	Images
																</Form.Label>
																<Form.Control
																	type="file"
																	ref={
																		fileInputImagesRef
																	}
																	multiple
																/>
															</Form.Group>
														</div>
														<div className="col-md-4">
															<Form.Group controlId="formBasicEmail">
																<Form.Label></Form.Label>
																<div
																	style={{
																		paddingTop: 3,
																	}}
																>
																	<Button
																		onClick={
																			uploadImages
																		}
																	>
																		Upload
																		Images
																	</Button>
																</div>
															</Form.Group>
														</div>
													</div>
												</div>

												<div className="col-12">
													<div
														className="row"
														style={{
															marginTop: 10,
															marginBottom: 10,
														}}
													>
														{images.map(
															(
																item,
																index
															) => (
																<div
																	key={
																		index
																	}
																	className="col-12 col-md-3"
																>
																	<img
																		alt="main"
																		style={{
																			maxWidth: '100%',
																			borderRadius: 7,
																		}}
																		src={
																			item
																				.location
																				.s3Url
																		}
																	/>
																	<span
																		style={{
																			color: 'red',
																		}}
																		file-location={
																			item
																				.location
																				.key
																		}
																		file-index={
																			index
																		}
																		onClick={
																			handleDeleteUploadedFile
																		}
																	></span>
																</div>
															)
														)}
													</div>
												</div>

												<div className="col-md-12">
													<div className="row">
														<div className="col-md-8">
															<Form.Group controlId="formBasicEmail">
																<Form.Label>
																	Vertical
																	Images
																	or
																	Posters
																</Form.Label>
																<Form.Control
																	type="file"
																	ref={
																		fileInputImagesVerticalRef
																	}
																	multiple
																/>
															</Form.Group>
														</div>
														<div className="col-md-4">
															<Form.Group controlId="formBasicEmail">
																<Form.Label></Form.Label>
																<div
																	style={{
																		paddingTop: 3,
																	}}
																>
																	<Button
																		onClick={
																			uploadVerticalImages
																		}
																	>
																		Upload
																		Vertical
																		Images
																	</Button>
																</div>
															</Form.Group>
														</div>
													</div>
												</div>

												<div className="col-12">
													<div
														className="row"
														style={{
															marginTop: 10,
															marginBottom: 10,
														}}
													>
														{imagesVertical.map(
															(
																item,
																index
															) => (
																<div
																	key={
																		index
																	}
																	className="col-12 col-md-3"
																>
																	<img
																		alt="poster"
																		style={{
																			maxWidth: '100%',
																			borderRadius: 7,
																		}}
																		src={
																			item
																				.location
																				.s3Url
																		}
																	/>
																</div>
															)
														)}
													</div>
												</div>
												<div className="col-md-12">
													<div className="row">
														<div className="col-md-8">
															<Form.Group controlId="formBasicEmail">
																<Form.Label>
																	Trailer
																	Video
																</Form.Label>
																<Form.Control
																	type="file"
																	ref={
																		fileInputVideoTrailerRef
																	}
																/>
															</Form.Group>
														</div>
														<div className="col-md-4">
															<Form.Group controlId="formBasicEmail">
																<Form.Label></Form.Label>
																<div
																	style={{
																		paddingTop: 3,
																	}}
																>
																	<Button
																		onClick={
																			uploadVideoTrailer
																		}
																	>
																		Upload
																		Trailer
																		Video
																	</Button>
																</div>
															</Form.Group>
														</div>
													</div>
												</div>

												<div className="col-12">
													<div
														className="row"
														style={{
															marginTop: 10,
															marginBottom: 10,
														}}
													>
														{Object.keys(
															videoTrailer
														)
															.length >
															0 && (
															<div
																key={
																	0
																}
																className="col-12 col-md-3"
															>
																<video
																	width="450"
																	src={
																		videoTrailer
																			.sourceLocation
																			.location
																			.cloudFrontUrl
																	}
																	controls="on"
																	autoPlay={
																		true
																	}
																/>
															</div>
														)}
													</div>
												</div>
												<div className="col-md-12">
													<div className="row">
														<div className="col-md-8">
															<Form.Group controlId="formBasicEmail">
																<Form.Label>
																	Main
																	Video
																</Form.Label>
																<Form.Control
																	type="file"
																	ref={
																		fileInputVideoMainRef
																	}
																/>
															</Form.Group>
														</div>
														<div className="col-md-4">
															<Form.Group controlId="formBasicEmail">
																<Form.Label></Form.Label>
																<div
																	style={{
																		paddingTop: 3,
																	}}
																>
																	<Button
																		onClick={
																			uploadVideoMain
																		}
																	>
																		Upload
																		Main
																		Video
																	</Button>
																</div>
															</Form.Group>
														</div>
													</div>
												</div>

												<div className="col-12">
													<div
														className="row"
														style={{
															marginTop: 10,
															marginBottom: 10,
														}}
													>
														{Object.keys(
															videoMain
														)
															.length >
															0 && (
															<div
																key={
																	0
																}
																className="col-12 col-md-3"
															>
																<video
																	width="450"
																	src={
																		videoMain
																			.sourceLocation
																			.location
																			.cloudFrontUrl
																	}
																	controls="on"
																	autoPlay={
																		true
																	}
																/>
															</div>
														)}
													</div>
												</div>
												<Form.Group
													className="col-12"
													controlId="formBasicEmail"
												>
													<Form.Label>
														Year of
														Release
													</Form.Label>
													<select
														className="form-control"
														value={
															yearOfRelease
														}
														onChange={e =>
															setYearOfRelease(
																e
																	.target
																	.value
															)
														}
														required={
															true
														}
													>
														{dateArray.map(
															(
																item,
																index
															) => (
																<option
																	key={
																		index
																	}
																	value={
																		item
																	}
																>
																	{
																		item
																	}
																</option>
															)
														)}
													</select>
												</Form.Group>
												<Form.Group
													className="col-12"
													controlId="formBasicEmail"
												>
													<Form.Label>
														Date of
														Release
													</Form.Label>
													<Form.Control
														type="date"
														value={
															dateOfRelease
														}
														onChange={e =>
															setDateOfRelease(
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
													className="col-12"
													controlId="formBasicEmail"
												>
													<Form.Label>
														Actors
													</Form.Label>
													<Form.Control
														type="text"
														value={
															actors
														}
														onChange={e =>
															setActors(
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
													className="col-12"
													controlId="formBasicEmail"
												>
													<Form.Label>
														Director
													</Form.Label>
													<Form.Control
														type="text"
														value={
															director
														}
														onChange={e =>
															setDirector(
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
													className="col-12"
													controlId="formBasicEmail"
												>
													<Form.Label>
														Production
														House
													</Form.Label>
													<Form.Control
														type="text"
														value={
															productionHouse
														}
														onChange={e =>
															setProductionHouse(
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
													className="col-12"
													controlId="formBasicEmail"
												>
													<Form.Label>
														IMDB
														Rating
													</Form.Label>
													<Form.Control
														type="number"
														value={
															imdbRating
														}
														onChange={e =>
															setImdbRating(
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
													className="col-12"
													controlId="formBasicEmail"
												>
													<Form.Label>
														Running
														Time
														(Seconds)
													</Form.Label>
													<Form.Control
														type="number"
														value={
															duration
														}
														onChange={e =>
															setDuration(
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
													className="col-12"
													controlId="formBasicEmail"
												>
													<Form.Label>
														Plot
													</Form.Label>
													<Form.Control
														as="textarea"
														row="5"
														value={
															plot
														}
														onChange={e =>
															setPlot(
																e
																	.target
																	.value
															)
														}
														style={{
															height: '100px',
														}}
														required={
															true
														}
													/>
												</Form.Group>
												<Form.Group
													className="col-12"
													controlId="formBasicEmail"
												>
													<Form.Label>
														Rated
													</Form.Label>
													<select
														className="form-control"
														aria-label="Default select example"
														name="rated"
														value={
															rated
														}
														onChange={e =>
															setRated(
																e
																	.target
																	.value
															)
														}
													>
														<option>
															--
															Choose
															--
														</option>
														<option value="U">
															U
														</option>
														<option value="U/A">
															U/A
														</option>
														<option value="A">
															A
														</option>
													</select>
												</Form.Group>

												<Form.Group
													className="col-12"
													controlId="formBasicEmail"
												>
													<Form.Label>
														Subscription
														Required
													</Form.Label>
													<select
														className="form-control"
														aria-label="Default select example"
														name="subscriptionRequired"
														value={
															subscriptionRequired
														}
														onChange={e =>
															setSubscriptionRequired(
																e
																	.target
																	.value
															)
														}
													>
														<option>
															--
															Choose
															--
														</option>
														<option value="true">
															Yes
														</option>
														<option value="false">
															No
														</option>
													</select>
												</Form.Group>

												<Form.Group
													style={{
														float: 'right',
													}}
												>
													<Button
														variant="primary"
														type="submit"
														disabled={
															images.length >
																0 &&
															imagesVertical.length >
																0 &&
															videoTrailer !==
																'' &&
															videoMain !==
																''
																? false
																: true
														}
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
