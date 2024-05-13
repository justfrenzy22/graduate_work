'use strict';
import { Route, Routes, useNavigate } from 'react-router-dom';
import NavigationBar from './components/Nav/NavigationBar';
import { Suspense, lazy, useContext } from 'react';
import { AppContext, AppContextTypes } from './utils/AppContext';
import HomePage from './pages/HomePage';
const Movie = lazy(() => import('./pages/Movie'));
const TV = lazy(() => import('./pages/TVshows'));
const PopularMovie = lazy(() => import('./pages/Movie/Popular'));
const TrendingMovie = lazy(() => import('./pages/Movie/Trending'));
const NowPlayingMovie = lazy(() => import('./pages/Movie/NowPlaying'));
const PopularTV = lazy(() => import('./pages/TV/Popular'));
const TrendingTV = lazy(() => import('./pages/TV/Trending'));
const NowPlayingTV = lazy(() => import('./pages/TV/NowPlaying'));
const Filter = lazy(() => import('./pages/Filter'));
const User = lazy(() => import('./pages/User'));

import Loader from './components/App/Loader';
import Footer from './components/App/Footer';
import Acc from './pages/Acc';
import { Button } from '@nextui-org/react';

const App = (): JSX.Element => {
	const { defaultLanguage, initLoad } =
		useContext<AppContextTypes>(AppContext);

	if (initLoad) {
		return <Loader lang={defaultLanguage} />;
	}

	return (
		<>
			<NavigationBar />
			<Suspense fallback={<Loader lang={defaultLanguage} />}>
				<Routes>
					{defaultLanguage ? (
						<>
							<Route
								path="/"
								element={<HomePage />}
							/>
							<Route
								path="/movie/:movieId"
								element={<Movie />}
							/>
							<Route
								path="/tv/:tvId/:season/:episode"
								element={<TV />}
							/>
							<Route
								path="/movie/popular"
								element={<PopularMovie />}
							/>
							<Route
								path="/movie/trending"
								element={<TrendingMovie />}
							/>
							<Route
								path="/movie/now_playing"
								element={<NowPlayingMovie />}
							/>
							<Route
								path="/tv/popular"
								element={<PopularTV />}
							/>
							<Route
								path="/tv/trending"
								element={<TrendingTV />}
							/>
							<Route
								path="/tv/now_playing"
								element={<NowPlayingTV />}
							/>
							<Route
								path="*"
								element={<ErrorComp />}
							/>
							<Route
								path="/filter"
								element={<Filter />}
							/>
							<Route
								path="/user/*"
								element={<User />}
							/>
							<Route
								path="/acc/:username"
								element={<Acc />}
							/>
						</>
					) : (
						<Route
							path="*"
							element={<Loader lang={defaultLanguage} />}
						/>
					)}
				</Routes>
			</Suspense>
			<Footer />
		</>
	);
};

export default App;

const ErrorComp = () => {
	const { defaultLanguage } = useContext<AppContextTypes>(AppContext);
	const navigate = useNavigate();
	return (
		<>
			<div className="flex flex-col items-center justify-center gap-4 p-4">
				<h1 className="text-4xl text-center font-bold">404</h1>
				<p className="text-2xl text-center">
					{defaultLanguage === 'en-US'
						? 'Page not Found'
						: 'Страницата не е намерена'}
				</p>
				<Button
					radius="full"
					color="primary"
					variant="shadow"
					onPress={() => navigate('/')}
					size="lg"
					className="text-xl text-center"
				>
					{defaultLanguage === 'en-US' ? 'Go Back' : 'Назад'}
				</Button>
			</div>
		</>
	);
};
