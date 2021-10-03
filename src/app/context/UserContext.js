import React from 'react';

const UserContext = React.createContext();

export const UserProvider = props => (
	<UserContext.Provider value={{ name: localStorage.getItem('name'), role: localStorage.getItem('role') }}>
		{props.children}
	</UserContext.Provider>
);

export default UserContext;
