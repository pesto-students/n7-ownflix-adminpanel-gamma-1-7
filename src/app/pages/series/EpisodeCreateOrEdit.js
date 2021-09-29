import React, { useContext, useEffect, useRef, useState } from 'react';
import S3 from 'react-aws-s3';
import { Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import LoaderContext from '../../context/LoaderContext';
import { s3ForImages, s3ForImagesDelete, s3ForVideoSource } from '../../utils/aws-s3-config';
import axios from '../../utils/axios-default';
import Form from 'react-bootstrap/Form';
import slugify from 'react-slugify';

export default function EpisodeCreateOrEdit(props) {
	const [series, setseries] = useState({});
	const [title, setTitle] = useState('');
	const [dateOfRelease, setDateOfRelease] = useState('');
	const [runningTime, setRunningTime] = useState('');
	const [actors, setActors] = useState('');
	const [plot, setPlot] = useState('');
	const [episodeNo, setEpisodeNo] = useState('');
	// const [errorText, setErrorText] = useState('');
	const [isLoading, setLoading] = useState(false);
	const useLoaderContext = useContext(LoaderContext);

	const [images, setImages] = useState([]);
	const [videoTrailer, setvideoTrailer] = useState({});
	const [videoMain, setVideoMain] = useState({});

	const fileInputImagesRef = useRef();

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
		axios.post('series-episodes/', {
			episodeNo,
			title,
			dateOfRelease,
			runningTime,
			actors,
			plot,
			images,
			videoTrailer,
			videoMain,
			series: series._id,
		})
			.then(res => {
				alert('Saved successfully');
				window.location.href = process.env.REACT_APP_URL + '/series/' + series.slug;
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

	const uploadVideoTrailer = e => {
		e.preventDefault();
		if (fileInputVideoTrailerRef.current.files.length !== 0) {
			let filesArray = fileInputVideoTrailerRef.current.files;
			const handleS3VideoUpload = file => {
				useLoaderContext.loadingText('Processing');
				useLoaderContext.toggleLoader(true);
				let newFileName = file.name.replace(/\..+$/, '');
				newFileName = slugify(newFileName);
				newFileName = parseInt(Math.random() * 10000000).toString() + '-' + newFileName;
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
		fileInputVideoTrailerRef.current.value = '';
	};

	const uploadVideoMain = e => {
		e.preventDefault();
		if (fileInputVideoMainRef.current.files.length !== 0) {
			let filesArray = fileInputVideoMainRef.current.files;
			const handleS3VideoUpload = file => {
				useLoaderContext.loadingText('Processing');
				useLoaderContext.toggleLoader(true);
				let newFileName = file.name.replace(/\..+$/, '');
				newFileName = slugify(newFileName);
				newFileName = parseInt(Math.random() * 10000000).toString() + '-' + newFileName;
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
		fileInputVideoMainRef.current.value = '';
	};

	useEffect(() => {
		let { id } = props.match.params;
		axios.get('/series/' + id).then(res => {
			setseries(res.data);
		});
	}, []);

	return (
		<>
			<Helmet defer={false}>
				<title>New Episode - {process.env.REACT_APP_NAME}</title>
			</Helmet>
			<div className="">
				<div className="container">
					<div>
						<div className="row">
							<div className="col-lg-12 grid-margin stretch-card">
								<div className="card">
									<div className="card-body">
										<h4 className="card-title bg-light clearfix ">
											New Episode [{series.title}]
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
														Episode
														No
													</Form.Label>
													<Form.Control
														type="Number"
														placeholder="Enter Episode No"
														value={
															episodeNo
														}
														onChange={e =>
															setEpisodeNo(
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
														Episode
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
																		alt="main "
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
														Running
														Time
													</Form.Label>
													<Form.Control
														type="text"
														value={
															runningTime
														}
														onChange={e =>
															setRunningTime(
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
