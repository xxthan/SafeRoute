import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { routeData } from "./data/routeData";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [destination, setDestination] = useState("");

  // MLP route result
  const [safetyResult, setSafetyResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Gemma report result
  const [reportText, setReportText] = useState("");
  const [reportResult, setReportResult] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  // Real mapping/data
  const [roads, setRoads] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState("");

  // --------------------------------------------------
  // DEMO ROUTE FOR MAP VISUALIZATION
  // --------------------------------------------------

  const demoRoute = [
    [12.9249, 80.1000],
    [12.9265, 80.1020],
    [12.9285, 80.1045],
    [12.9305, 80.1070],
    [12.9330, 80.1090],
  ];

  const goTo = (nextPage) => {
    setPage(nextPage);
    window.scrollTo(0, 0);
  };

  // --------------------------------------------------
  // LOAD REAL ROAD + PLACE DATA
  // React -> FastAPI -> CSV data
  // --------------------------------------------------

  const loadMapData = async () => {
    setMapLoading(true);
    setMapError("");

    try {
      const roadsResponse = await fetch(
        "http://localhost:8000/roads"
      );

      if (!roadsResponse.ok) {
        throw new Error("Could not load road data");
      }

      const roadsData = await roadsResponse.json();

      setRoads(roadsData.roads || []);

      // Tambaram demo coordinates
      const nearbyResponse = await fetch(
        "http://localhost:8000/nearby-places?latitude=12.9249&longitude=80.1000&radius_km=2"
      );

      if (!nearbyResponse.ok) {
        throw new Error("Could not load nearby places");
      }

      const placesData = await nearbyResponse.json();

      setNearbyPlaces(placesData.places || []);

      console.log(
        "SafeRoute roads:",
        roadsData.roads
      );

      console.log(
        "SafeRoute nearby places:",
        placesData.places
      );
    } catch (error) {
      console.error(
        "Mapping data error:",
        error
      );

      setMapError(
        "Could not load mapping data. Make sure FastAPI is running."
      );
    } finally {
      setMapLoading(false);
    }
  };

  // Load real mapping data when app starts
  useEffect(() => {
    loadMapData();
  }, []);

  // --------------------------------------------------
  // ROUTE ANALYSIS
  // React -> FastAPI -> MLP -> React
  // --------------------------------------------------

  const analyzeRoute = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/analyze-route",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            route_id: "route_1",
            lighting_score: 0.8,
            incident_count: 2,
            dog_reports: 1,
            activity_level: 0.7,
            safe_places: 5,
            time_of_day: new Date().getHours(),
            ai_lighting_issue: 0,
            ai_dog_issue: 0,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Backend request failed"
        );
      }

      const result = await response.json();

      console.log(
        "SafeRoute backend result:",
        result
      );

      setSafetyResult(result);

      goTo("routes");
    } catch (error) {
      console.error(
        "Backend error:",
        error
      );

      alert(
        "Could not connect to SafeRoute backend. Make sure FastAPI is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // COMMUNITY REPORT
  // React -> FastAPI -> Gemma -> MLP -> React
  // --------------------------------------------------

  const submitReport = async () => {
    if (!reportText.trim()) {
      alert(
        "Please describe the issue first."
      );

      return;
    }

    setReportLoading(true);
    setReportResult(null);

    try {
      const response = await fetch(
        "http://localhost:8000/analyze-report-route",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            route_id: "route_1",
            report_text: reportText,
            lighting_score: 0.5,
            incident_count: 4,
            dog_reports: 3,
            activity_level: 0.5,
            safe_places: 3,
            time_of_day: new Date().getHours(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Report analysis failed"
        );
      }

      const result = await response.json();

      console.log(
        "AI report result:",
        result
      );

      setReportResult(result);
    } catch (error) {
      console.error(
        "Report error:",
        error
      );

      alert(
        "Could not connect to SafeRoute backend. Make sure FastAPI is running."
      );
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="app">

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <header className="navbar">

        <button
          className="logo-button"
          onClick={() => goTo("home")}
        >

          <div className="logo-box">
            🛡
          </div>

          <span>
            SafeRoute
          </span>

        </button>


        <nav className="nav-links">

          <button
            className={
              page === "home"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() => goTo("home")}
          >
            Home
          </button>


          <button
            className={
              page === "about"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() => goTo("about")}
          >
            About
          </button>


          <button
            className={
              page === "report"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() => goTo("report")}
          >
            Report
          </button>

        </nav>


        <button
          className="profile-button"
          onClick={() => goTo("profile")}
          aria-label="Open profile"
        >
          ♙
        </button>

      </header>


      {/* ==================================================
          HOME
      ================================================== */}

      {page === "home" && (

        <main className="home-page">

          <section className="home-left">

            <p className="eyebrow">
              PLAN YOUR JOURNEY
            </p>


            <h1>
              Get there with
              <br />
              confidence.
            </h1>


            <p className="hero-description">
              Choose routes using lighting, activity,
              and community safety information.
            </p>


            {/* STARTING POINT */}

            <div className="location-card">

              <div className="location-icon start-icon"></div>

              <div>

                <span className="field-label">
                  STARTING POINT
                </span>

                <strong>
                  {routeData.currentLocation}
                </strong>

              </div>

            </div>


            {/* DESTINATION */}

            <div className="location-card">

              <div className="location-icon">
                ⌖
              </div>

              <div className="destination-field">

                <span className="field-label">
                  DESTINATION
                </span>

                <input
                  value={destination}
                  onChange={(event) =>
                    setDestination(
                      event.target.value
                    )
                  }
                  placeholder="Where are you going?"
                />

              </div>

            </div>


            {/* FIND ROUTES */}

            <button
              className="primary-button"
              onClick={analyzeRoute}
              disabled={loading}
            >

              <span>
                {loading
                  ? "Analyzing..."
                  : "Find routes"}
              </span>

              <span className="button-arrow">
                →
              </span>

            </button>


            <p className="compare-text">
              Compare routes using available safety
              information.
            </p>


            <div className="feature-list">

              <div>
                💡 Lighting information
              </div>

              <div>
                👥 Community reports
              </div>

              <div>
                🛡 Route comparison
              </div>

            </div>

          </section>


          {/* ==================================================
              REAL INTERACTIVE MAP
          ================================================== */}

          <section className="home-map">

            <div className="coverage-card">

              <span className="coverage-dot">
                ●
              </span>

              <div>

                <span className="mini-label">
                  AVAILABLE COVERAGE
                </span>

                <strong>
                  {routeData.coverage.area}
                </strong>

              </div>

            </div>


            <MapContainer
              center={[
                12.9249,
                80.1000,
              ]}
              zoom={14}
              scrollWheelZoom={true}
              style={{
                height: "100%",
                width: "100%",
                minHeight: "520px",
                borderRadius: "28px",
              }}
            >

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />


              {/* ------------------------------------------
                  RECOMMENDED ROUTE
              ------------------------------------------ */}

              <Polyline
                positions={demoRoute}
                pathOptions={{
                  weight: 6,
                }}
              >

                <Popup>

                  <strong>
                    Recommended Route
                  </strong>

                  <br />

                  Route A

                  <br />

                  Model safety indicator:{" "}

                  {safetyResult
                    ? `${Math.round(
                        safetyResult.safety_indicator *
                          100
                      )}%`
                    : "86%"}

                </Popup>

              </Polyline>


              {/* ------------------------------------------
                  REAL ROAD DATA
              ------------------------------------------ */}

              {roads.map(
                (road, index) => {

                  const latitude =
                    Number(
                      road.latitude
                    );

                  const longitude =
                    Number(
                      road.longitude
                    );

                  if (
                    !Number.isFinite(
                      latitude
                    ) ||
                    !Number.isFinite(
                      longitude
                    )
                  ) {
                    return null;
                  }

                  return (

                    <CircleMarker
                      key={`road-${index}`}
                      center={[
                        latitude,
                        longitude,
                      ]}
                      radius={8}
                    >

                      <Popup>

                        <strong>
                          {road.road_name ||
                            road.name ||
                            `Road ${index + 1}`}
                        </strong>

                        <br />

                        Road data point

                      </Popup>

                    </CircleMarker>

                  );
                }
              )}


              {/* ------------------------------------------
                  REAL NEARBY PLACES
              ------------------------------------------ */}

              {nearbyPlaces.map(
                (place, index) => {

                  const latitude =
                    Number(
                      place.latitude
                    );

                  const longitude =
                    Number(
                      place.longitude
                    );

                  if (
                    !Number.isFinite(
                      latitude
                    ) ||
                    !Number.isFinite(
                      longitude
                    )
                  ) {
                    return null;
                  }

                  return (

                    <CircleMarker
                      key={`place-${index}`}
                      center={[
                        latitude,
                        longitude,
                      ]}
                      radius={10}
                    >

                      <Popup>

                        <strong>
                          {place.name}
                        </strong>

                        <br />

                        {place.type}

                        <br />

                        {place.distance_km} km away

                      </Popup>

                    </CircleMarker>

                  );
                }
              )}

            </MapContainer>

          </section>

        </main>

      )}


      {/* ==================================================
          ROUTES
      ================================================== */}

      {page === "routes" && (

        <main className="inner-page">

          <div className="page-heading">

            <p className="eyebrow">
              ROUTE OPTIONS
            </p>

            <h2>
              Choose your route.
            </h2>

            <p>
              Compare available routes using the safety
              information currently available.
            </p>

          </div>


          {/* MLP RESULT */}

          {safetyResult && (

            <div className="notice-card">

              <strong>
                🛡 Route safety indicator
              </strong>

              <p>
                Model estimate based on the available
                route features:
              </p>

              <h2>
                {(
                  safetyResult.safety_indicator *
                  100
                ).toFixed(0)}
                %
              </h2>

              <p>
                Lighting:{" "}
                {safetyResult.lighting}

                {" · "}

                Incidents:{" "}
                {safetyResult.incidents}

                {" · "}

                Activity:{" "}
                {safetyResult.activity}
              </p>

            </div>

          )}


          {/* REAL MAPPING DATA */}

          <div className="notice-card">

            <strong>
              🗺️ Available mapping data
            </strong>


            {mapLoading && (

              <p>
                Loading road and place data...
              </p>

            )}


            {mapError && (

              <p>
                {mapError}
              </p>

            )}


            {!mapLoading &&
              !mapError && (

                <>

                  <p>
                    {roads.length} road records and{" "}
                    {nearbyPlaces.length} nearby
                    places are available.
                  </p>


                  {roads.length > 0 && (

                    <div>

                      <strong>
                        Roads:
                      </strong>


                      {roads
                        .slice(0, 5)
                        .map(
                          (
                            road,
                            index
                          ) => (

                            <p
                              key={index}
                            >

                              🛣️{" "}

                              {road.road_name ||
                                road.name ||
                                `Road ${index + 1}`}

                            </p>

                          )
                        )}

                    </div>

                  )}


                  {nearbyPlaces.length > 0 && (

                    <div>

                      <strong>
                        Nearby places:
                      </strong>


                      {nearbyPlaces
                        .slice(0, 5)
                        .map(
                          (
                            place,
                            index
                          ) => (

                            <p
                              key={index}
                            >

                              📍{" "}

                              {place.name}

                              {" · "}

                              {place.type}

                              {" · "}

                              {place.distance_km} km

                            </p>

                          )
                        )}

                    </div>

                  )}

                </>

              )}

          </div>


          {/* ROUTE CARDS */}

          <div className="route-grid">


            {/* ROUTE A */}

            <div className="route-card recommended-route-card">

              <div className="route-top">

                <span className="route-tag">
                  RECOMMENDED
                </span>

                <span>
                  {routeData.routes[0].duration}
                </span>

              </div>


              <h3>
                Route A
              </h3>


              <p>
                {routeData.routes[0].distance}

                {" · "}

                {routeData.routes[0].insights[0]}
              </p>


              <div className="route-details">

                <span>
                  💡{" "}
                  {routeData.routes[0].safety.lighting}
                  {" "}lighting
                </span>

                <span>
                  👥{" "}
                  {routeData.routes[0].safety.activity}
                  {" "}activity
                </span>

                <span>
                  🐾{" "}
                  {routeData.routes[0].safety.animalReports}
                  {" "}report
                </span>

              </div>


              <button
                className="primary-button small-button"
                onClick={() =>
                  goTo("route-details")
                }
              >
                View route →
              </button>

            </div>


            {/* ROUTE B */}

            <div className="route-card">

              <div className="route-top">

                <span className="route-tag muted-tag">
                  ALTERNATIVE
                </span>

                <span>
                  {routeData.routes[1].duration}
                </span>

              </div>


              <h3>
                Route B
              </h3>


              <p>
                {routeData.routes[1].distance}

                {" · "}

                {routeData.routes[1].insights[0]}
              </p>


              <div className="route-details">

                <span>
                  💡{" "}
                  {routeData.routes[1].safety.lighting}
                  {" "}lighting
                </span>

                <span>
                  👥{" "}
                  {routeData.routes[1].safety.activity}
                  {" "}activity
                </span>

                <span>
                  🐾{" "}
                  {routeData.routes[1].safety.animalReports}
                  {" "}reports
                </span>

              </div>


              <button
                className="secondary-button"
                onClick={() =>
                  goTo("route-details")
                }
              >
                View route →
              </button>

            </div>

          </div>

        </main>

      )}


      {/* ==================================================
          ROUTE DETAILS
      ================================================== */}

      {page === "route-details" && (

        <main className="inner-page">

          <button
            className="back-button"
            onClick={() =>
              goTo("routes")
            }
          >
            ← Back to routes
          </button>


          <div className="page-heading">

            <p className="eyebrow">
              ROUTE INSIGHTS
            </p>

            <h2>
              {routeData.routes[0].name}
            </h2>

            <p>
              {routeData.routes[0].duration}

              {" · "}

              {routeData.routes[0].distance}
            </p>

          </div>


          {safetyResult && (

            <div className="notice-card">

              <strong>
                🛡 Model safety indicator
              </strong>

              <h2>
                {(
                  safetyResult.safety_indicator *
                  100
                ).toFixed(0)}
                %
              </h2>

              <p>
                This is a model estimate based on
                available route features.
              </p>

            </div>

          )}


          <div className="insight-grid">


            <div className="insight-card">

              <span className="insight-icon">
                💡
              </span>

              <span className="mini-label">
                LIGHTING
              </span>

              <h3>
                {routeData.routes[0].insights[0]}
              </h3>

              <p>
                Available information indicates good
                lighting along most of this route.
              </p>

            </div>


            <div className="insight-card">

              <span className="insight-icon">
                👥
              </span>

              <span className="mini-label">
                ACTIVITY
              </span>

              <h3>
                {routeData.routes[0].safety.activity}
                {" "}activity
              </h3>

              <p>
                Some sections show higher pedestrian
                activity when information is available.
              </p>

            </div>


            <div className="insight-card">

              <span className="insight-icon">
                🐾
              </span>

              <span className="mini-label">
                COMMUNITY REPORTS
              </span>

              <h3>
                {routeData.routes[0].safety.animalReports}
                {" "}animal report
              </h3>

              <p>
                A community report is available near
                the route.
              </p>

            </div>


            <div className="insight-card">

              <span className="insight-icon">
                🛡
              </span>

              <span className="mini-label">
                REPORTS
              </span>

              <h3>
                {routeData.routes[0].safety.incidents}
                {" "}reported incidents
              </h3>

              <p>
                Available incident information is
                limited in this area.
              </p>

            </div>

          </div>


          {/* NEARBY PLACES */}

          <div className="notice-card">

            <strong>
              📍 Nearby places
            </strong>


            {nearbyPlaces.length === 0 ? (

              <p>
                No nearby places found.
              </p>

            ) : (

              nearbyPlaces.map(
                (place, index) => (

                  <p key={index}>

                    📍{" "}

                    <strong>
                      {place.name}
                    </strong>

                    {" · "}

                    {place.type}

                    {" · "}

                    {place.distance_km} km away

                  </p>

                )
              )

            )}

          </div>


          <div className="notice-card">

            <strong>
              Important
            </strong>

            <p>
              SafeRoute provides route insights using
              available data and community reports.
              It does not guarantee personal safety.
            </p>

          </div>

        </main>

      )}


      {/* ==================================================
          ABOUT
      ================================================== */}

      {page === "about" && (

        <main className="about-page">


          <section className="about-header">

            <p className="eyebrow">
              HOW SAFEROUTE WORKS
            </p>


            <h2>
              Know your route.
              <br />
              Before you take it.
            </h2>


            <p>
              SafeRoute helps you understand the
              conditions around a route using available
              lighting, activity, community and
              environmental information.
            </p>

          </section>


          <section className="about-section">

            <div className="section-heading">

              <span className="section-number">
                01
              </span>

              <h3>
                What we look at
              </h3>

            </div>


            <div className="about-card-grid">


              <div className="about-info-card">

                <div className="about-icon">
                  💡
                </div>

                <span className="card-label">
                  LIGHTING
                </span>

                <h3>
                  Street lighting
                </h3>

                <p>
                  Understand whether the route has
                  well-lit, limited-lighting, or unknown
                  areas based on available information.
                </p>

              </div>


              <div className="about-info-card">

                <div className="about-icon">
                  👥
                </div>

                <span className="card-label">
                  ACTIVITY
                </span>

                <h3>
                  Activity & people
                </h3>

                <p>
                  See areas with higher or lower
                  pedestrian activity when information
                  is available.
                </p>

              </div>


              <div className="about-info-card">

                <div className="about-icon">
                  🐾
                </div>

                <span className="card-label">
                  COMMUNITY REPORTS
                </span>

                <h3>
                  Animal reports
                </h3>

                <p>
                  View community-reported animal-related
                  concerns near or along the route.
                </p>

              </div>


              <div className="about-info-card">

                <div className="about-icon">
                  🛡
                </div>

                <span className="card-label">
                  REPORTS
                </span>

                <h3>
                  Reported incidents
                </h3>

                <p>
                  See available reports and areas where
                  additional caution may be appropriate.
                </p>

              </div>

            </div>

          </section>


          <section className="about-section">

            <div className="section-heading">

              <span className="section-number">
                02
              </span>

              <h3>
                Your route, explained.
              </h3>

            </div>


            <div className="route-explanation">

              <div className="route-step start-step">
                <span>
                  START
                </span>
              </div>

              <div className="route-line"></div>

              <div className="route-step">

                <span className="step-icon">
                  💡
                </span>

                <strong>
                  Well-lit area
                </strong>

              </div>

              <div className="route-line"></div>

              <div className="route-step">

                <span className="step-icon">
                  👥
                </span>

                <strong>
                  Higher activity
                </strong>

              </div>

              <div className="route-line"></div>

              <div className="route-step">

                <span className="step-icon">
                  🐾
                </span>

                <strong>
                  Community report
                </strong>

              </div>

              <div className="route-line"></div>

              <div className="route-step">

                <span className="step-icon">
                  💡
                </span>

                <strong>
                  Well-lit area
                </strong>

              </div>

              <div className="route-line"></div>

              <div className="route-step destination-step">

                <span>
                  DESTINATION
                </span>

              </div>

            </div>


            <p className="section-note">

              SafeRoute combines available information
              to help you compare routes. It does not
              guarantee that a route is safe.

            </p>

          </section>


          <section className="about-section">

            <div className="section-heading">

              <span className="section-number">
                03
              </span>

              <h3>
                Available data coverage
              </h3>

            </div>


            <div className="coverage-about-card">


              <div className="coverage-state">

                <span className="state-dot good"></span>

                <div>

                  <strong>
                    {routeData.coverage.level}
                  </strong>

                  <p>
                    More information is available
                    for this area.
                  </p>

                </div>

              </div>


              <div className="coverage-state">

                <span className="state-dot limited"></span>

                <div>

                  <strong>
                    Limited coverage
                  </strong>

                  <p>
                    Some information is available.
                  </p>

                </div>

              </div>


              <div className="coverage-state">

                <span className="state-dot unavailable"></span>

                <div>

                  <strong>
                    Limited or unavailable
                  </strong>

                  <p>
                    There may not be enough information
                    to provide useful indicators.
                  </p>

                </div>

              </div>


              <p className="coverage-note">

                Data coverage can vary by location and
                may change over time.

              </p>

            </div>

          </section>


          <section className="about-section">

            <div className="section-heading">

              <span className="section-number">
                04
              </span>

              <h3>
                Help improve the map
              </h3>

            </div>


            <div className="community-card">

              <div>

                <span className="card-label">
                  COMMUNITY REPORTS
                </span>

                <h3>
                  Help improve the map
                </h3>

                <p>
                  Community reports can help highlight
                  things that may not appear in other
                  data sources, such as broken
                  streetlights, animal-related concerns,
                  road problems, or other local issues.
                </p>

              </div>


              <button
                className="primary-button report-button"
                onClick={() => goTo("report")}
              >
                Report an issue →
              </button>

            </div>

          </section>


          <section className="about-section">

            <div className="safety-note-card">

              <span className="card-label">
                IMPORTANT
              </span>

              <h3>
                A note about safety
              </h3>

              <p>
                SafeRoute provides route insights using
                available data and community reports.
                Information may be incomplete, outdated,
                or unavailable in some areas. SafeRoute
                does not guarantee personal safety.
              </p>

            </div>

          </section>

        </main>

      )}


      {/* ==================================================
          REPORT
      ================================================== */}

      {page === "report" && (

        <main className="inner-page">

          <button
            className="back-button"
            onClick={() => goTo("home")}
          >
            ← Back
          </button>


          <div className="page-heading">

            <p className="eyebrow">
              COMMUNITY
            </p>

            <h2>
              Report an issue.
            </h2>

            <p>
              Help improve SafeRoute by sharing
              something you noticed on your route.
            </p>

          </div>


          <div className="report-form">


            <label>

              What did you notice?

              <select>

                <option>
                  Broken streetlight
                </option>

                <option>
                  Animal-related concern
                </option>

                <option>
                  Road problem
                </option>

                <option>
                  Other issue
                </option>

              </select>

            </label>


            <label>

              Add details

              <textarea
                value={reportText}
                onChange={(event) =>
                  setReportText(
                    event.target.value
                  )
                }
                placeholder="Example: The road is very dark and there are many stray dogs near the bus stop at night."
                rows="6"
              />

            </label>


            <button
              className="primary-button"
              onClick={submitReport}
              disabled={reportLoading}
            >

              {reportLoading
                ? "Analyzing report..."
                : "Submit report →"}

            </button>


            {reportResult && (

              <div className="notice-card">

                <strong>
                  🧠 AI report analysis
                </strong>


                <p>

                  Lighting issue:{" "}

                  {reportResult.ai_features
                    ?.lighting_issue
                    ? "Detected"
                    : "Not detected"}

                </p>


                <p>

                  Dog/animal issue:{" "}

                  {reportResult.ai_features
                    ?.dog_issue
                    ? "Detected"
                    : "Not detected"}

                </p>


                <p>
                  Updated route safety indicator:
                </p>


                <h2>

                  {(
                    reportResult.safety_indicator *
                    100
                  ).toFixed(0)}
                  %

                </h2>


                <p>

                  This is a model estimate based on
                  the available route data and submitted
                  report. It is not a guarantee of
                  personal safety.

                </p>

              </div>

            )}

          </div>

        </main>

      )}


      {/* ==================================================
          PROFILE
      ================================================== */}

      {page === "profile" && (

        <main className="inner-page">

          <div className="page-heading">

            <p className="eyebrow">
              ACCOUNT
            </p>

            <h2>
              Your profile.
            </h2>

            <p>
              Your SafeRoute preferences and activity.
            </p>

          </div>


          <div className="profile-card-large">

            <div className="profile-avatar">
              ♙
            </div>

            <div>

              <span className="card-label">
                PROFILE
              </span>

              <h3>
                SafeRoute User
              </h3>

              <p>
                Community member
              </p>

            </div>

          </div>


          <div className="profile-options">

            <div>

              <span>
                📍
              </span>

              <div>

                <strong>
                  Saved locations
                </strong>

                <p>
                  Your frequently used places.
                </p>

              </div>

            </div>


            <div>

              <span>
                🛡
              </span>

              <div>

                <strong>
                  Safety preferences
                </strong>

                <p>
                  Manage the information you want to see.
                </p>

              </div>

            </div>

          </div>

        </main>

      )}

    </div>
  );
}

export default App;