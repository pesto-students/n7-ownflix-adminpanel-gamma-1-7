import React, { useEffect, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';

export const LoaderContext = React.createContext();

export function LoaderProvider(props) {
	const [text, setText] = useState('Loading...');
	const [isLoaderActive, setIsLoaderActive] = useState(true);

	const toggleLoader = val => {
		setIsLoaderActive(val);
	};

	const loadingText = text => {
		setText(text);
	};
	useEffect(() => {
		setIsLoaderActive(false);
	}, []);

	return (
		<LoaderContext.Provider
			value={{
				isLoaderActive,
				toggleLoader,
				text,
				loadingText,
			}}
		>
			<LoadingOverlay active={isLoaderActive} spinner text={text}>
				{props.children}
			</LoadingOverlay>
		</LoaderContext.Provider>
	);
}

export default LoaderContext;
