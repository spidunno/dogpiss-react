import {
	Layer,
	// AttributionControl,
	Map,
	MapRef,
	Marker,
	Source,
	// NavigationControl,
	ViewState,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { Point, StyleSpecification } from "mapbox-gl";
import {
	Box,
	Button,
	// Button,
	ButtonGroup,
	Card,
	IconButton,
	// Input,
	// Link,
	ToggleButtonGroup,
	// Typography,
	useColorScheme,
} from "@mui/joy";
import {
	MinusIcon,
	MonitorCogIcon,
	MoonIcon,
	PlusIcon,
	SunIcon,
} from "lucide-react";
import { styled, useTheme } from "@mui/joy/styles";
import { createClient } from "@supabase/supabase-js";
// import { SearchBox } from "@mapbox/search-js-react";
// import { accessToken } from "mapbox-gl";
import {
	useInterval,
	// useDebounceCallback,
	// useDebounceValue,
	useMediaQuery,
} from "usehooks-ts";
import useGeolocation from "react-hook-geolocation";
import { Database } from "./supabase";

type LightPreset = "dawn" | "day" | "dusk" | "night";

const mapboxAccessToken =
	"pk.eyJ1Ijoic3BpZHVubm8iLCJhIjoiY2x3YXZtMGt5MGkyajJwdHhrMTZ4NGx1MSJ9.u2FfwTZYNI2Q4LAni2BSsg";

const supabaseUrl = "https://tonunwxiclqnexwgbqxu.supabase.co";
const supabaseKeyDontStealPleaseColonThree =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvbnVud3hpY2xxbmV4d2dicXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNjIyMjQsImV4cCI6MjA1NzYzODIyNH0.Mig--A27VcVMlkuqpK_1Ak7sTlZAfzAKUjJG5HxO0Ro";
const supabase = createClient<Database>(
	supabaseUrl,
	supabaseKeyDontStealPleaseColonThree
);

type Position = [number, number];

async function addPoint(coordinates: Position) {
	const { error } = await supabase.from("points").insert({
		created_at: new Date().toISOString(),
		location: `POINT(${coordinates[1]} ${coordinates[0]})`,
	});
	console.error(error);
	return;
}

const StyledMarker = styled(Marker)({});

export default function App() {
	const { colorScheme, mode, setMode } = useColorScheme();

	// const [searchResults, setSearchResults] = useState<object[]>([]);
	// const [searchBoxInput, setSearchBoxInput] = useState<string>("");
	// const [searchBoxInputDebounced] = useDebounceValue(searchBoxInput, 250, {
	// 	trailing: true,
	// });

	// useEffect(() => {
	// 	if (searchBoxInputDebounced === "") {
	// 		setSearchResults([]);
	// 		return;
	// 	}
	// 	fetch(
	// 		`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
	// 			searchBoxInputDebounced
	// 		)}`
	// 	).then((v) => {
	// 		v.json().then((v) => {
	// 			setSearchResults(v);
	// 		});
	// 	});
	// }, [searchBoxInputDebounced]);

	// @ts-expect-error lol
	const [viewState, setViewState] = useState<ViewState>({});

	const geolocation = useGeolocation({
		enableHighAccuracy: true,
		maximumAge: 5000,
	});

	const [lightPreset, setLightPreset] = useState<LightPreset>(
		colorScheme === "light" ? "day" : "dusk"
	);

	useEffect(() => {
		setLightPreset(colorScheme === "light" ? "day" : "dusk");
	}, [colorScheme]);
	const initialStyle = useRef<StyleSpecification>({
		version: 8,
		imports: [
			{
				id: "basemap",
				url: "mapbox://styles/mapbox/standard",
				config: {
					lightPreset: lightPreset,
				},
			},
		],
		sources: {},
		layers: [],
	});
	useInterval(() => {
		setRefreshBool((prev) => !prev);
	}, 15000);
	const mapRef = useRef<MapRef>(null);
	const theme = useTheme();

	// useEffect(() => {
	// 	if (!mapRef.current) return;

	// 	mapRef.current.resize();
	// }, []);
	const [ refreshBool, setRefreshBool ] = useState(false);

	useEffect(() => {
		// @ts-expect-error no clue
		globalThis.mapRef = mapRef;
		if (!mapRef.current) return;

		mapRef.current.setConfigProperty("basemap", "lightPreset", lightPreset);
	}, [lightPreset]);
	const [loaded, setLoaded] = useState(false);

	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				position: "relative",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{/* <Box sx={{height: '48px'}}>test</Box> */}
			<Box
				sx={(theme) => ({
					width: "100%",
					height: "100%",
					position: "relative",
					"& .mapboxgl-ctrl.mapboxgl-ctrl-attrib:not(.mapboxgl-compact)": {
						// display: 'none',
						backgroundColor: theme.palette.neutral.softBg,
						fontFamily: "Inter !important",
						borderTopLeftRadius: theme.radius.sm,
						"& *": {
							color: `${theme.palette.neutral.softColor} !important`,
						},
					},
					"& .mapboxgl-ctrl.mapboxgl-ctrl-attrib.mapboxgl-compact": {
						"& .mapboxgl-ctrl-attrib-button": {
							// '&:before': {
							// backgroundColor: theme.palette.neutral.softColor,
							// backgroundImage: "none",
							// maskImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd'%3E%3Cpath d='M4 10a6 6 0 1 0 12 0 6 6 0 1 0-12 0m5-3a1 1 0 1 0 2 0 1 1 0 1 0-2 0m0 3a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0'/%3E%3C/svg%3E")`,
							// width: '24px',
							// height: '24px',
							// position: 'absolute',
							// top: 0,
							// left: 0
							// },
							// position: 'relative',
							"&::before": {
								width: "24px",
								height: "24px",
								position: "absolute",
								top: "0",
								left: "0",
								backgroundColor: "red",
							},
							"& .mapboxgl-ctrl-icon": {
								maskImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd'%3E%3Cpath d='M4 10a6 6 0 1 0 12 0 6 6 0 1 0-12 0m5-3a1 1 0 1 0 2 0 1 1 0 1 0-2 0m0 3a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0'/%3E%3C/svg%3E") !important`,
								backgroundColor: theme.palette.neutral.softColor,
							},
							backgroundImage: "none",
							backgroundColor: "transparent",
							padding: "0",
							boxShadow: "none !important",
							"&:hover": {
								"& .mapboxgl-ctrl-icon": {
									maskImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd'%3E%3Cpath d='M4 10a6 6 0 1 0 12 0 6 6 0 1 0-12 0m5-3a1 1 0 1 0 2 0 1 1 0 1 0-2 0m0 3a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0'/%3E%3C/svg%3E") !important`,
									backgroundColor: theme.palette.neutral.softHoverColor,
								},
								backgroundColor: theme.palette.neutral.softHoverBg,
							},
							"&:active": {
								"& .mapboxgl-ctrl-icon": {
									maskImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd'%3E%3Cpath d='M4 10a6 6 0 1 0 12 0 6 6 0 1 0-12 0m5-3a1 1 0 1 0 2 0 1 1 0 1 0-2 0m0 3a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0'/%3E%3C/svg%3E") !important`,
									backgroundColor: theme.palette.neutral.softHoverColor,
								},
								backgroundColor: theme.palette.neutral.softActiveBg,
							},
						},
						"& .mapboxgl-ctrl-attrib-inner *": {
							color: `${theme.palette.neutral.softColor} !important`,
						},
						backgroundColor: theme.palette.neutral.softBg,
					},
				})}
			>
				<Map
					localFontFamily="Inter"
					mapboxAccessToken={mapboxAccessToken}
					// mapStyle={"mapbox://styles/mapbox/standard"}
					mapStyle={initialStyle.current}
					// @ts-expect-error this should work idk why it doesn't
					projection={"globe"}
					// mapStyle={"mapbox://styles/mapbox/streets-v12"}
					style={{ width: "100%", height: "100%", outline: "none" }}
					hash={true}
					onMove={(e) => {
						setViewState(e.viewState);
					}}
					// viewState={viewState }
					// lightPreset={"dusk"}
					// light={"dusk"}
					ref={mapRef}
					minZoom={0.43629520106164177}
					onLoad={(e) => {
						setLoaded(true);
						const { lat, lng } = e.target.getCenter();
						setViewState({
							bearing: e.target.getBearing(),
							pitch: e.target.getPitch(),
							zoom: e.target.getZoom(),
							latitude: lat,
							longitude: lng,
							// @ts-expect-error no clue
							padding: e.target.getPadding(),
						});
					}}
				>
					<StyledMarker rotationAlignment="map" offset={new Point(0, 0)} color="transparent" sx={(theme) => ({
						background: theme.palette.primary.solidBg,
						border: `2px solid white`,
						width: "20px",
						height: "20px",
						borderRadius: "16px",
						"& svg": {
							display: "none"
						},
						transformStyle: "preserve-3d"
					})} longitude={geolocation.longitude} rotation={(geolocation.heading || 0) * (180 / Math.PI)} latitude={geolocation.latitude}>
						<Box sx={(theme) => ({
							// rotate: "45deg",
							transformOrigin: "bottom right",
							transform: `translateZ(-1px) translateX(-17.5px) translateY(-17.5px) rotate(45deg)`,
							width: "25px",
							height: "25px",
							opacity: "0.75",
							background: theme.palette.primary.solidBg,
							position: "relative",
							// right: "17.5px",
							// bottom: "17.5px",
							borderRadius: "100% 0 0 0"
						})}>

						</Box>
					</StyledMarker>
					{loaded ? (
						<Source
							type="vector"
							tiles={[
								`https://martin.queerhome.xyz/public.points/{z}/{x}/{y}.pbf${refreshBool ? "?" : ""}`,
							]}
							minzoom={0}
							maxzoom={22}
							// source={{
							// 	type: "vector",
							// 	tiles: [`http://localhost:7800/public.points/{z}/{x}/{y}.pbf`],
							// 	// tiles: ["http://queerhome.xyz:8232/public.points/{z}/{x}/{y}.pbf"],
							// 	minzoom: 0,
							// 	maxzoom: 22,
							// 	// url: "http://localhost:7800/public.points.json",
							// }}
						>
							<Layer
								type="heatmap"
								source-layer="public.points"
								paint={{
									"heatmap-color": [
										"interpolate",
										["linear"],
										["heatmap-density"],
										0,
										"rgba(0, 0, 255, 0)",
										0.1,
										"royalblue",
										0.3,
										"cyan",
										0.5,
										"lime",
										0.7,
										"yellow",
										1,
										"red",
									],
								}}
								// style={{
								// type: "heatmap",
								// // source: 'points',
								// "source-layer": "public.points",
								// // type: "line",
								// paint: [
								// 	"interpolate",
								// 	["linear"],
								// 	["heatmap-density"],
								// 	0,
								// 	"rgba(0, 0, 255, 0)",
								// 	0.1,
								// 	"royalblue",
								// 	0.3,
								// 	"cyan",
								// 	0.5,
								// 	"lime",
								// 	0.7,
								// 	"yellow",
								// 	1,
								// 	"red",
								// ],
								// }}
							/>
						</Source>
					) : null}
				</Map>
				<Box
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						pointerEvents: "none",
						"& *": {
							pointerEvents: "all",
						},
					}}
				>
					<Card sx={{
						position: "absolute",
						bottom: "12px",
						left: "calc(50% - 64px)",
						display: "flex",
						width: "fit-content",
						marginLeft: "auto",
						marginRight: "auto",
						flexDireciton: "row",
						borderRadius: "8px",
						margin: 0,
						padding: 0
					}}>
					<Button onClick={() => {
					if (!geolocation) return; 
					addPoint([
						geolocation.latitude,
						geolocation.longitude,
					]).then(() => {
						setRefreshBool((prev) => !prev)
					});
				}} size="lg" variant="outlined">
						Dog peed
					</Button>
					</Card>
					{/* <Card
						sx={{
							position: "absolute",
							bottom: 0,
							right: 0,
							display: 'flex',
							flexDirection: 'row',
							borderBottomRightRadius: '0',
							borderTopRightRadius: '0',
							borderBottomLeftRadius: '0'
						}}
						size="sm"
					>
						<Link href={"https://www.mapbox.com/about/maps/"}>
							<Typography level="body-xs">© Mapbox</Typography>
						</Link>
						<Link href={"https://www.openstreetmap.org/about/"}>
							<Typography level="body-xs">© OpenStreetMap</Typography>
						</Link>
						<Link href={""}>
							<Typography level="body-xs" fontWeight={"bold"}>Improve this map</Typography>
						</Link>
					</Card> */}
					{/* <Card
						sx={{
							position: "absolute",
							padding: "0",
							left: "12px",
							top: "12px",
						}}
					>
						<Input size="lg" placeholder="Search for a location"/>

					</Card> */}

					{/* 		<Card
						sx={{
							border: "none",
							width: "fit-content",
							position: "absolute",
							top: "12px",
							left: "12px",
							padding: "0",
						}}
					><Input size="lg" placeholder="Search for a location" value={searchBoxInput} onChange={(e) => setSearchBoxInput(e.target.value)}/></Card> */}

					<Card
						sx={{
							border: "none",
							width: "fit-content",
							position: "absolute",
							top: "12px",
							right: "12px",
							padding: "0",
						}}
					>
						<ToggleButtonGroup
							value={mode}
							onChange={(_e, value) => setMode(value)}
							variant={"outlined"}
						>
							<IconButton aria-label="Dark Theme" value="dark">
								<MoonIcon />
							</IconButton>
							<IconButton aria-label="Dark Theme" value="system">
								<MonitorCogIcon />
							</IconButton>
							<IconButton aria-label="Dark Theme" value="light">
								<SunIcon />
							</IconButton>
						</ToggleButtonGroup>
					</Card>

					<Card
						sx={{
							border: "none",
							position: "absolute",
							padding: "0",
							bottom: useMediaQuery("(max-width: 640px)") ? "46px" : "32px",
							right: "12px",
						}}
					>
						<ButtonGroup orientation="vertical">
							<IconButton
								onClick={() => {
									if (!mapRef.current) return;
									mapRef.current.zoomIn();
								}}
							>
								<PlusIcon />
							</IconButton>
							<IconButton
								onClick={() => {
									if (!mapRef.current) return;
									mapRef.current.zoomOut();
								}}
							>
								<MinusIcon />
							</IconButton>
							<IconButton
								onClick={() => {
									if (!mapRef.current) return;
									mapRef.current.resetNorth();
								}}
							>
								<svg
									style={{
										transform: `perspective(1.5cm) rotateX(${
											viewState.pitch / 1.5
										}deg) rotateZ(${-viewState.bearing}deg)`,
										perspective: "1cm",
									}}
									xmlns="http://www.w3.org/2000/svg"
									fill={theme.palette.text.primary}
									viewBox="0 0 29 29"
								>
									<path d="M10.5 14l4-8 4 8h-8z" />
									<path
										id="south"
										d="M10.5 16l4 8 4-8h-8z"
										fill={theme.palette.neutral[400]}
									/>
								</svg>
							</IconButton>
						</ButtonGroup>
					</Card>
				</Box>
			</Box>
		</Box>
	);
}
