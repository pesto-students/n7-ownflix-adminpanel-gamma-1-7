import React, { Component, lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from './hoc/PrivateRoute';
import Spinner from './pages/shared/Spinner';
import { login, logout } from './redux';

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));

const Movies = lazy(() => import('./pages/movies/Movies'));
const MovieCreateOrEdit = lazy(() => import('./pages/movies/MovieCreateOrEdit'));

const Genres = lazy(() => import('./pages/genres/Genres'));
const GenreCreateOrEdit = lazy(() => import('./pages/genres/GenreCreateOrEdit'));

const Series = lazy(() => import('./pages/series/Series'));
const SeriesCreateOrEdit = lazy(() => import('./pages/series/SeriesCreateOrEdit'));
const Episodes = lazy(() => import('./pages/series/Episodes'));
const EpisodeCreate = lazy(() => import('./pages/series/EpisodeCreateOrEdit'));

const Subscriptions = lazy(() => import('./pages/subscriptions/Subscriptions'));

const Users = lazy(() => import('./pages/users/Users'));
const UserCreateOrEdit = lazy(() => import('./pages/users/UserCreateOrEdit'));

const Error404 = lazy(() => import('./pages/error-pages/Error404'));

const Login = lazy(() => import('./pages/user-pages/Login'));

class AppRoutes extends Component {
	render() {
		return (
			<Suspense fallback={<Spinner />}>
				<Switch>
					<PrivateRoute exact path="/" component={Dashboard} />
					<PrivateRoute exact path="/dashboard" component={Dashboard} />

					<PrivateRoute exact={true} path="/users" component={Users} />
					<PrivateRoute exact={true} path="/users/create" component={UserCreateOrEdit} />

					<PrivateRoute exact={true} path="/movies" component={Movies} />
					<PrivateRoute
						exact={true}
						path="/movies/create"
						component={MovieCreateOrEdit}
					/>
					<PrivateRoute exact={true} path="/series" component={Series} />
					<PrivateRoute
						exact={true}
						path="/series/create"
						component={SeriesCreateOrEdit}
					/>
					<PrivateRoute exact={true} path="/series/:slug" component={Episodes} />
					<PrivateRoute exact={true} path="/genres" component={Genres} />
					<PrivateRoute
						exact={true}
						path="/genres/create"
						component={GenreCreateOrEdit}
					/>
					<PrivateRoute
						exact={true}
						path="/series/episode/create/:id"
						component={EpisodeCreate}
					/>
					<PrivateRoute exact={true} path="/subscriptions" component={Subscriptions} />

					<Route path="/login" component={Login} />
					<Route path="*" component={Error404} />
				</Switch>
			</Suspense>
		);
	}
}

const mapStateToProps = state => {
	return {
		isLogin: state.isLogin,
	};
};
const mapDispatchToProps = dispatch => {
	return {
		login: () => dispatch(login()),
		logout: () => dispatch(logout()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AppRoutes);
