import { useState } from "react";
import { routeData } from "./data/routeData";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [destination, setDestination] = useState("");

  const goTo = (nextPage) => {
    setPage(nextPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <button className="logo-button" onClick={() => goTo("home")}>
          <div className="logo-box">🛡</div>
          <span>SafeRoute</span>
        </button>

        <nav className="nav-links">
          <button
            className={page === "home" ? "nav-link active" : "nav-link"}
            onClick={() => goTo("home")}
          >
            Home
          </button>

          <button
            className={page === "about" ? "nav-link active" : "nav-link"}
            onClick={() => goTo("about")}
          >
            About
          </button>

          <button
            className={page === "report" ? "nav-link active" : "nav-link"}
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

      {/* HOME */}
      {page === "home" && (
        <main className="home-page">
          <section className="home-left">

            <p className="eyebrow">PLAN YOUR JOURNEY</p>

            <h1>
              Get there with
              <br />
              confidence.
            </h1>

            <p className="hero-description">
              Choose routes using lighting, activity, and community
              safety information.
            </p>

            <div className="location-card">
              <div className="location-icon start-icon"></div>

              <div>
                <span className="field-label">STARTING POINT</span>
                <strong>{routeData.currentLocation}</strong>
              </div>
            </div>

            <div className="location-card">
              <div className="location-icon">⌖</div>

              <div className="destination-field">
                <span className="field-label">DESTINATION</span>

                <input
                  value={destination}
                  onChange={(event) =>
                    setDestination(event.target.value)
                  }
                  placeholder="Where are you going?"
                />
              </div>
            </div>

            <button
              className="primary-button"
              onClick={() => goTo("routes")}
            >
              <span>Find routes</span>
              <span className="button-arrow">→</span>
            </button>

            <p className="compare-text">
              Compare routes using available safety information.
            </p>

            <div className="feature-list">
              <div>💡 Lighting information</div>
              <div>👥 Community reports</div>
              <div>🛡 Route comparison</div>
            </div>

          </section>

          <section className="home-map">

            <div className="coverage-card">
              <span className="coverage-dot">●</span>

              <div>
                <span className="mini-label">AVAILABLE COVERAGE</span>
                <strong>{routeData.coverage.area}</strong>
              </div>
            </div>

            <div className="map-label">NORTH AVENUE</div>

            <div className="map-road road-one"></div>
            <div className="map-road road-two"></div>
            <div className="map-road road-three"></div>

            <div className="map-destination">⌖</div>

            <div className="recommended-card">
              <div className="recommended-icon">🛡</div>

              <div>
                <strong>{routeData.routes[0].name}</strong>
                <span>
                 {routeData.routes[0].duration} · {routeData.routes[0].distance}
                </span>
              </div>
            </div>

          </section>
        </main>
      )}

      {/* ROUTES */}
      {page === "routes" && (
        <main className="inner-page">
          <div className="page-heading">
            <p className="eyebrow">ROUTE OPTIONS</p>
            <h2>Choose your route.</h2>
            <p>
              Compare available routes using the safety information
              currently available.
            </p>
          </div>

          <div className="route-grid">

            <div className="route-card recommended-route-card">
              <div className="route-top">
                <span className="route-tag">RECOMMENDED</span>
                <span>{routeData.routes[0].duration}</span>
              </div>

              <h3>Route A</h3>

              <p>{routeData.routes[0].distance} · {routeData.routes[0].insights[0]}</p>

              <div className="route-details">
                <span>💡 {routeData.routes[0].safety.lighting} lighting</span>
                <span>👥 {routeData.routes[0].safety.activity} activity</span>
                <span>🐾 {routeData.routes[0].safety.animalReports} report</span>
              </div>

              <button
                className="primary-button small-button"
                onClick={() => goTo("route-details")}
              >
                View route →
              </button>
            </div>

            <div className="route-card">
              <div className="route-top">
                <span className="route-tag muted-tag">ALTERNATIVE</span>
                <span>{routeData.routes[1].duration}</span>
              </div>

              <h3>Route B</h3>

              <p>{routeData.routes[1].distance} · {routeData.routes[1].insights[0]}</p>

              <div className="route-details">
                <span>💡 {routeData.routes[1].safety.lighting} lighting</span>
                <span>👥 {routeData.routes[1].safety.activity} activity</span>
                <span>🐾 {routeData.routes[1].safety.animalReports} reports</span>
              </div>

              <button
                className="secondary-button"
                onClick={() => goTo("route-details")}
              >
                View route →
              </button>
            </div>

          </div>
        </main>
      )}

      {/* ROUTE DETAILS */}
      {page === "route-details" && (
        <main className="inner-page">

          <button
            className="back-button"
            onClick={() => goTo("routes")}
          >
            ← Back to routes
          </button>

          <div className="page-heading">
            <p className="eyebrow">ROUTE INSIGHTS</p>
            <h2>{routeData.routes[0].name}</h2>
            <p>{routeData.routes[0].duration} · {routeData.routes[0].distance}</p>
          </div>

          <div className="insight-grid">

            <div className="insight-card">
              <span className="insight-icon">💡</span>
              <span className="mini-label">LIGHTING</span>
              <h3>{routeData.routes[0].insights[0]}</h3>
              <p>
                Available information indicates good lighting along
                most of this route.
              </p>
            </div>

            <div className="insight-card">
              <span className="insight-icon">👥</span>
              <span className="mini-label">ACTIVITY</span>
              <h3>{routeData.routes[0].safety.activity} activity</h3>
              <p>
                Some sections show higher pedestrian activity when
                information is available.
              </p>
            </div>

            <div className="insight-card">
              <span className="insight-icon">🐾</span>
              <span className="mini-label">COMMUNITY REPORTS</span>
              <h3>{routeData.routes[0].safety.animalReports} animal report</h3>
              <p>
                A community report is available near the route.
              </p>
            </div>

            <div className="insight-card">
              <span className="insight-icon">🛡</span>
              <span className="mini-label">REPORTS</span>
              <h3>{routeData.routes[0].safety.incidents} reported incidents</h3>
              <p>
                Available incident information is limited in this
                area.
              </p>
            </div>

          </div>

          <div className="notice-card">
            <strong>Important</strong>
            <p>
              SafeRoute provides route insights using available data
              and community reports. It does not guarantee personal
              safety.
            </p>
          </div>

        </main>
      )}

      {/* ABOUT */}
      {page === "about" && (
        <main className="about-page">

          <section className="about-header">
            <p className="eyebrow">HOW SAFEROUTE WORKS</p>

            <h2>
              Know your route.
              <br />
              Before you take it.
            </h2>

            <p>
              SafeRoute helps you understand the conditions around a
              route using available lighting, activity, community and
              environmental information.
            </p>
          </section>

          {/* WHAT WE LOOK AT */}
          <section className="about-section">

            <div className="section-heading">
              <span className="section-number">01</span>
              <h3>What we look at</h3>
            </div>

            <div className="about-card-grid">

              <div className="about-info-card">
                <div className="about-icon">💡</div>
                <span className="card-label">LIGHTING</span>
                <h3>Street lighting</h3>
                <p>
                  Understand whether the route has well-lit,
                  limited-lighting, or unknown areas based on
                  available information.
                </p>
              </div>

              <div className="about-info-card">
                <div className="about-icon">👥</div>
                <span className="card-label">ACTIVITY</span>
                <h3>Activity & people</h3>
                <p>
                  See areas with higher or lower pedestrian activity
                  when information is available.
                </p>
              </div>

              <div className="about-info-card">
                <div className="about-icon">🐾</div>
                <span className="card-label">COMMUNITY REPORTS</span>
                <h3>Animal reports</h3>
                <p>
                  View community-reported animal-related concerns
                  near or along the route.
                </p>
              </div>

              <div className="about-info-card">
                <div className="about-icon">🛡</div>
                <span className="card-label">REPORTS</span>
                <h3>Reported incidents</h3>
                <p>
                  See available reports and areas where additional
                  caution may be appropriate.
                </p>
              </div>

            </div>
          </section>

          {/* ROUTE EXPLAINED */}
          <section className="about-section">

            <div className="section-heading">
              <span className="section-number">02</span>
              <h3>Your route, explained.</h3>
            </div>

            <div className="route-explanation">

              <div className="route-step start-step">
                <span>START</span>
              </div>

              <div className="route-line"></div>

              <div className="route-step">
                <span className="step-icon">💡</span>
                <strong>Well-lit area</strong>
              </div>

              <div className="route-line"></div>

              <div className="route-step">
                <span className="step-icon">👥</span>
                <strong>Higher activity</strong>
              </div>

              <div className="route-line"></div>

              <div className="route-step">
                <span className="step-icon">🐾</span>
                <strong>Community report</strong>
              </div>

              <div className="route-line"></div>

              <div className="route-step">
                <span className="step-icon">💡</span>
                <strong>Well-lit area</strong>
              </div>

              <div className="route-line"></div>

              <div className="route-step destination-step">
                <span>DESTINATION</span>
              </div>

            </div>

            <p className="section-note">
              SafeRoute combines available information to help you
              compare routes. It does not guarantee that a route is
              safe.
            </p>

          </section>

          {/* DATA COVERAGE */}
          <section className="about-section">

            <div className="section-heading">
              <span className="section-number">03</span>
              <h3>Available data coverage</h3>
            </div>

            <div className="coverage-about-card">

              <div className="coverage-state">
                <span className="state-dot good"></span>

                <div>
                  <strong>{routeData.coverage.level}</strong>
                  <p>More information is available for this area.</p>
                </div>
              </div>

              <div className="coverage-state">
                <span className="state-dot limited"></span>

                <div>
                  <strong>Limited coverage</strong>
                  <p>Some information is available.</p>
                </div>
              </div>

              <div className="coverage-state">
                <span className="state-dot unavailable"></span>

                <div>
                  <strong>Limited or unavailable</strong>
                  <p>
                    There may not be enough information to provide
                    useful indicators.
                  </p>
                </div>
              </div>

              <p className="coverage-note">
                Data coverage can vary by location and may change
                over time.
              </p>

            </div>
          </section>

          {/* COMMUNITY REPORTS */}
          <section className="about-section">

            <div className="section-heading">
              <span className="section-number">04</span>
              <h3>Help improve the map</h3>
            </div>

            <div className="community-card">

              <div>
                <span className="card-label">COMMUNITY REPORTS</span>

                <h3>Help improve the map</h3>

                <p>
                  Community reports can help highlight things that
                  may not appear in other data sources, such as broken
                  streetlights, animal-related concerns, road
                  problems, or other local issues.
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

          {/* SAFETY NOTE */}
          <section className="about-section">

            <div className="safety-note-card">

              <span className="card-label">IMPORTANT</span>

              <h3>A note about safety</h3>

              <p>
                SafeRoute provides route insights using available
                data and community reports. Information may be
                incomplete, outdated, or unavailable in some areas.
                SafeRoute does not guarantee personal safety.
              </p>

            </div>

          </section>

        </main>
      )}

      {/* REPORT */}
      {page === "report" && (
        <main className="inner-page">

          <button
            className="back-button"
            onClick={() => goTo("home")}
          >
            ← Back
          </button>

          <div className="page-heading">
            <p className="eyebrow">COMMUNITY</p>
            <h2>Report an issue.</h2>
            <p>
              Help improve SafeRoute by sharing something you noticed
              on your route.
            </p>
          </div>

          <div className="report-form">

            <label>
              What did you notice?
              <select>
                <option>Broken streetlight</option>
                <option>Animal-related concern</option>
                <option>Road problem</option>
                <option>Other issue</option>
              </select>
            </label>

            <label>
              Add details
              <textarea
                placeholder="Tell us what happened..."
                rows="6"
              ></textarea>
            </label>

            <button
              className="primary-button"
              onClick={() => alert("Report submitted for the prototype!")}
            >
              Submit report →
            </button>

          </div>

        </main>
      )}

      {/* PROFILE */}
      {page === "profile" && (
        <main className="inner-page">

          <div className="page-heading">
            <p className="eyebrow">ACCOUNT</p>
            <h2>Your profile.</h2>
            <p>Your SafeRoute preferences and activity.</p>
          </div>

          <div className="profile-card-large">
            <div className="profile-avatar">♙</div>

            <div>
              <span className="card-label">PROFILE</span>
              <h3>SafeRoute User</h3>
              <p>Community member</p>
            </div>
          </div>

          <div className="profile-options">

            <div>
              <span>📍</span>
              <div>
                <strong>Saved locations</strong>
                <p>Your frequently used places.</p>
              </div>
            </div>

            <div>
              <span>🛡</span>
              <div>
                <strong>Safety preferences</strong>
                <p>Manage the information you want to see.</p>
              </div>
            </div>

          </div>

        </main>
      )}

    </div>
  );
}

export default App;