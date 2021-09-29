function config(directory, bucketName, s3Url) {
	return {
		dirName: directory,
		bucketName: bucketName,
		region: process.env.REACT_APP_REGION,
		accessKeyId: process.env.REACT_APP_ACCESS_ID,
		secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
		s3Url: s3Url,
	};
}
function configForDelete(bucketName, s3Url) {
	return {
		bucketName: bucketName,
		accessKeyId: process.env.REACT_APP_ACCESS_ID,
		secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
		s3Url: s3Url,
	};
}

export function s3ForImages(directory) {
	return config(directory, 'watchflix-image-bucket', 'https://watchflix-image-bucket.s3.amazonaws.com/');
}
export function s3ForImagesDelete() {
	return configForDelete('watchflix-image-bucket', 'https://watchflix-image-bucket.s3.amazonaws.com/');
}

export function s3ForVideoSource(directory) {
	return config(
		directory,
		'new-media-stack-source71e471f1-b69d352rqn84',
		'https://new-media-stack-source71e471f1-b69d352rqn84.s3.amazonaws.com/'
	);
}

export default config;
