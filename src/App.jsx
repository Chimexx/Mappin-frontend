import { useState, useEffect, useContext } from "react";
import ReactMapGL, { GeolocateControl, Marker, Popup } from "react-map-gl";
import { MdLocationPin } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";
import "./app.css";
import axios from "axios";
import { format } from "timeago.js";
import Account from "./Account";
import { GlobalContext } from "./context";

function App() {
	const [currentUser, setCurrentUser] = useContext(GlobalContext);

	const [pins, setPins] = useState([]);
	const [currentPlaceId, setCurrentPlaceId] = useState(null);
	const [newPlace, setNewPlace] = useState(null);
	const [place, setPlace] = useState("");
	const [review, setReview] = useState("");
	const [rating, setRating] = useState(null);

	const [viewport, setViewport] = useState({
		width: "1100px",
		height: "100vh",
		latitude: 0,
		longitude: 0,
		zoom: 4,
	});

	const geolocateControlStyle = {
		right: 10,
		top: 10,
	};

	useEffect(() => {
		const getPins = async () => {
			try {
				const res = await axios.get("http://localhost:5000/api/pins");
				setPins(res.data);
			} catch (error) {
				alert("Unable to fetch");
			}
		};
		getPins();
	}, []);

	const handleMarkerClick = (id, lat, long) => {
		setCurrentPlaceId(id);
		setViewport({ ...viewport, longitude: long, latitude: lat });
	};

	const handleAddPlace = (e) => {
		const [long, lat] = e.lngLat;
		setNewPlace({ long, lat });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const newPin = {
			username: currentUser?.username,
			place,
			review,
			rating,
			lat: newPlace.lat,
			long: newPlace.long,
		};

		try {
			const res = await axios.post("http://localhost:5000/api/pins", newPin);
			setPins([...pins, res.data]);
			setNewPlace(null);
			console.log(res.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(function (position) {
			setViewport({
				...viewport,
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			});
		});
	}, [viewport]);

	return (
		<div className="container">
			<div className="account">
				<Account />
			</div>
			<div className="map">
				<ReactMapGL
					mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
					{...viewport}
					mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
					onViewportChange={(nextViewport) => setViewport(nextViewport)}
					onDblClick={(e) => handleAddPlace(e)}
					transitionDuration={300}
				>
					<GeolocateControl
						style={geolocateControlStyle}
						positionOptions={{ enableHighAccuracy: true }}
						trackUserLocation={true}
						showUserLocation={true}
						auto
					/>
					{pins.map((pin) => {
						return (
							<div key={pin._id}>
								<Marker
									latitude={pin.lat}
									longitude={pin.long}
									offsetLeft={viewport.zoom * 3.5}
									offsetTop={-viewport.zoom * 7}
								>
									<div>
										<MdLocationPin
											style={{
												fontSize: viewport.zoom * 7,
												color: `${
													pin.username === currentUser?.username
														? "#ff8400"
														: "#4287f5"
												}`,
												cursor: "pointer",
											}}
											onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
										/>
									</div>
								</Marker>
								{pin._id === currentPlaceId && (
									<Popup
										latitude={pin.lat}
										longitude={pin.long}
										closeButton={true}
										closeOnClick={false}
										onClose={() => setCurrentPlaceId(null)}
										anchor="left"
									>
										<div className="card">
											<label className="label">Place</label>
											<h4 className="place">{pin.place}</h4>
											<label className="label">Review</label>
											<p>{pin.review}</p>
											<label className="label">Rating</label>
											<div className="stars">
												{Array(pin.rating).fill(<AiFillStar className="star" />)}
											</div>
											<label className="label">Info</label>

											<span className="username">
												Created by <strong>{pin.username}</strong>
											</span>

											<span className="date">
												<i> {format(pin.createdAt)}</i>
											</span>
										</div>
									</Popup>
								)}
								{newPlace && (
									<Popup
										latitude={newPlace.lat}
										longitude={newPlace.long}
										closeButton={true}
										closeOnClick={false}
										onClose={() => setNewPlace(null)}
										anchor="left"
									>
										<div className="card">
											<form onSubmit={(e) => handleSubmit(e)}>
												<input
													className="title"
													type="text"
													placeholder="Where is this place?"
													onChange={(e) => setPlace(e.target.value.toUpperCase())}
												></input>

												<textarea
													className="review"
													type="text"
													placeholder="Say something about this place "
													onChange={(e) => setReview(e.target.value)}
												></textarea>
												<div className="bottomDiv">
													<label className="rating">Rating</label>
													<select
														className="select"
														htmlFor="rating"
														onChange={(e) => setRating(e.target.value)}
													>
														<option className="option" value={1}>
															1
														</option>
														<option className="option" value={2}>
															2
														</option>
														<option className="option" value={3}>
															3
														</option>
														<option className="option" value={4}>
															4
														</option>
														<option className="option" value={5}>
															5
														</option>
													</select>
													<button className="submitButton" type="submit">
														Add Pin
													</button>
												</div>
											</form>
										</div>
									</Popup>
								)}
							</div>
						);
					})}
				</ReactMapGL>
			</div>
		</div>
	);
}

export default App;
