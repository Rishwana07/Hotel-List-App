import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const API_URL = "https://hotel-list-app.onrender.com";

function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const hotels = useSelector((state) => state.hotels.hotels);

  // Try to find the hotel in the Redux store first
  const storeHotel = hotels.find((item) => String(item.id) === id);
  const hasStoreHotel = Boolean(storeHotel);

  // If not in the store (e.g. page refresh), fetch it from the backend
  const [fetchedHotel, setFetchedHotel] = useState(null);
  const [isLoadingHotel, setIsLoadingHotel] = useState(!hasStoreHotel);

  const hotel = storeHotel || fetchedHotel;

  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Fetch hotel by id when it is not available in the store
  useEffect(() => {
    if (hasStoreHotel) {
      setIsLoadingHotel(false);
      return;
    }

    let ignore = false;
    setIsLoadingHotel(true);

    fetch(`${API_URL}/api/hotels/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Hotel not found");
        return res.json();
      })
      .then((data) => {
        if (!ignore) setFetchedHotel(data.hotel || data);
      })
      .catch(() => {
        if (!ignore) setFetchedHotel(null);
      })
      .finally(() => {
        if (!ignore) setIsLoadingHotel(false);
      });

    return () => {
      ignore = true;
    };
  }, [id, hasStoreHotel]);

  // Reset current location when opening another hotel
  useEffect(() => {
    setCurrentLocation(null);
    setLocationError("");
  }, [id]);

  // Convert backend image path into full image URL
  const imageSrc = hotel?.image
    ? hotel.image.startsWith("http")
      ? hotel.image
      : `${API_URL}${hotel.image}`
    : "https://placehold.co/700x350?text=No+Image";

  // Validate hotel coordinates
  const hasValidCoordinates =
    hotel &&
    hotel.latitude !== "" &&
    hotel.longitude !== "" &&
    hotel.latitude !== null &&
    hotel.longitude !== null &&
    Number.isFinite(Number(hotel.latitude)) &&
    Number.isFinite(Number(hotel.longitude)) &&
    Number(hotel.latitude) >= -90 &&
    Number(hotel.latitude) <= 90 &&
    Number(hotel.longitude) >= -180 &&
    Number(hotel.longitude) <= 180;

  // Get current location using browser Geolocation API
  function getCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    setIsLoadingLocation(true);
    setLocationError("");
    setCurrentLocation(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        let message = "Unable to get your current location.";

        if (error.code === error.PERMISSION_DENIED) {
          message =
            "Location permission denied. Please allow location access in your browser.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Your current location is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          message = "Location request timed out. Please try again.";
        }

        setLocationError(message);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  // Loading state (must stay AFTER all hooks)
  if (isLoadingHotel) {
    return (
      <main className="container">
        <p>Loading hotel...</p>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {hotel ? `${hotel.title} | Hotel Details` : "Hotel Not Found"}
        </title>

        <meta
          name="description"
          content={
            hotel
              ? `View ${hotel.title}, including its price, description, and location.`
              : "The requested hotel could not be found."
          }
        />
      </Helmet>

      <main className="container">
        {!hotel ? (
          <section className="hotel-details">
            <h1>Hotel Not Found</h1>

            <p>The hotel you are looking for does not exist.</p>

            <button type="button" onClick={() => navigate("/")}>
              Back to Hotels
            </button>
          </section>
        ) : (
          <section className="hotel-details">
            <h1>{hotel.title}</h1>

            <img
              src={imageSrc}
              alt={hotel.title}
              style={{
                width: "100%",
                maxWidth: "700px",
                height: "350px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/700x350?text=Image+Not+Found";
              }}
            />

            <h2 className="hotel-price">
              ₹{Number(hotel.price).toLocaleString("en-IN")} / night
            </h2>

            <h3>Description</h3>
            <p>{hotel.description}</p>

            {/* Hotel location */}
            <section style={{ margin: "24px 0" }}>
              <h3>Hotel Location</h3>

              <p>Latitude: {hotel.latitude}</p>
              <p>Longitude: {hotel.longitude}</p>

              {hasValidCoordinates ? (
                <iframe
                  title={`Map showing ${hotel.title}`}
                  width="100%"
                  height="350"
                  style={{
                    border: 0,
                    borderRadius: "10px",
                  }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${Number(
                    hotel.latitude
                  )},${Number(hotel.longitude)}&output=embed`}
                />
              ) : (
                <p>Valid hotel coordinates are not available.</p>
              )}

              {hasValidCoordinates && (
                <p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${Number(
                      hotel.latitude
                    )},${Number(hotel.longitude)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open hotel location in Google Maps
                  </a>
                </p>
              )}
            </section>

            <hr />

            {/* Browser current location */}
            <section style={{ margin: "24px 0" }}>
              <h3>My Current Location</h3>

              <p>
                Click the button below and allow browser permission to get
                your current coordinates.
              </p>

              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
              >
                {isLoadingLocation
                  ? "Getting Location..."
                  : "Get My Current Location"}
              </button>

              {locationError && (
                <p role="alert" style={{ color: "red" }}>
                  {locationError}
                </p>
              )}

              {currentLocation && (
                <div style={{ marginTop: "20px" }}>
                  <h4>Your Coordinates</h4>

                  <p>Latitude: {currentLocation.latitude}</p>
                  <p>Longitude: {currentLocation.longitude}</p>

                  <h4>Your Location Map</h4>

                  <iframe
                    title="Map showing your current location"
                    width="100%"
                    height="350"
                    style={{
                      border: 0,
                      borderRadius: "10px",
                    }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}&output=embed`}
                  />

                  <p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${currentLocation.latitude},${currentLocation.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open my location in Google Maps
                    </a>
                  </p>
                </div>
              )}
            </section>

            {/* Navigation buttons */}
            <div className="card-actions" style={{ marginTop: "24px" }}>
              <button
                type="button"
                onClick={() => navigate(`/edit-hotel/${hotel.id}`)}
              >
                Edit Hotel
              </button>

              <Link to="/">
                <button type="button">Back to Hotels</button>
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default HotelDetails;