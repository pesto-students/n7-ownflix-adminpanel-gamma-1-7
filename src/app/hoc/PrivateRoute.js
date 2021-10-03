import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

function PrivateRoute({ component: Component, ...rest }) {
	// for fucntional component
	const isLogin = useSelector(state => state.isLogin);
	// const dispatch = useDispatch();

	return (
		<Route
			{...rest}
			render={props => {
				return isLogin ? <Component {...props} /> : <Redirect to="/login" />;
			}}
		></Route>
	);
}
export default PrivateRoute;
