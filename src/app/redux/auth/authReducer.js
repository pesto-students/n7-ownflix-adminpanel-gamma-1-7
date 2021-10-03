const inititalAuthState = {
	isLogin: localStorage.getItem('accessToken') ? true : false,
};

const authReducer = (state = inititalAuthState, action) => {
	switch (action.type) {
		case 'LOGIN':
			return {
				...state,
				isLogin: true,
			};
		case 'LOGOUT':
			return {
				...state,
				isLogin: false,
			};
		default:
			return state;
	}
};

export default authReducer;
