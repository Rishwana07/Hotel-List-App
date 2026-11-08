
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
  addHotel,
  updateHotel,
} from "../features/hotelsSlice";

function HotelForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hotel = useSelector((state) =>
    state.hotels.hotels.find(
      (item) => String(item.id) === id
    )
  );

  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [latitude, setLatitude] = useState("13.0827");
  const [longitude, setLongitude] = useState("80.2707");

  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Load existing hotel details for editing
  useEffect(() => {
    if (isEditing && hotel) {
      setTitle(hotel.title);
      setDescription(hotel.description || "");
      setPrice(String(hotel.price));
      setLatitude(String(hotel.latitude ?? ""));
      setLongitude(String(hotel.longitude ?? ""));
      setImage(hotel.image || "");
      setImageFile(null);
    }
  }, [isEditing, hotel]);

  // Handle image selection
  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
      setImageFile(file);
      setError("");
    };

    reader.onerror = () => {
      setError("Unable to read this image. Please try again.");
    };

    reader.readAsDataURL(file);
  }

  // Submit hotel details to backend
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Please enter the hotel name and description.");
      return;
    }

    if (
      price.trim() === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0
    ) {
      setError("Price must be greater than zero.");
      return;
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
      latitude.trim() === "" ||
      longitude.trim() === "" ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      setError("Enter valid latitude and longitude values.");
      return;
    }

    if (isEditing && !hotel) {
      setError("Hotel not found.");
      return;
    }

    // Create FormData for image upload
    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("price", Number(price));
    formData.append("latitude", lat);
    formData.append("longitude", lng);

    // Send actual image file if selected
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setSaving(true);

      if (isEditing) {
        await dispatch(
          updateHotel({
            id: hotel.id,
            formData,
          })
        ).unwrap();
      } else {
        await dispatch(addHotel(formData)).unwrap();
      }

      navigate("/", {
        state: {
          message: isEditing
            ? "Hotel updated successfully!"
            : "Hotel added successfully!",
        },
      });
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : "Unable to save hotel. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  // Convert backend image path into full image URL
  const previewImage = image
    ? image.startsWith("/uploads/")
      ? `https://hotel-list-app.onrender.com${image}`
      : image
    : "";

  return (
    <>
      <Helmet>
        <title>
          {isEditing
            ? hotel
              ? `Edit ${hotel.title} | Hotel Management System`
              : "Hotel Not Found | Hotel Management System"
            : "Add New Hotel | Hotel Management System"}
        </title>

        <meta
          name="description"
          content={
            isEditing
              ? `Update the details of ${hotel ? hotel.title : "your hotel"}.`
              : "Add a new hotel with its details, image, price and location."
          }
        />
      </Helmet>

      <main className="container">
        {isEditing && !hotel ? (
          <>
            <h1>Hotel Not Found</h1>
            <p>The hotel you are looking for does not exist.</p>

            <button
              type="button"
              onClick={() => navigate("/")}
            >
              Back to Hotels
            </button>
          </>
        ) : (
          <>
            <h1>{isEditing ? "Edit Hotel" : "Add Hotel"}</h1>
            <p>Enter the hotel details below.</p>

            <form onSubmit={handleSubmit}>
              {error && (
                <p role="alert" style={{ color: "red" }}>
                  {error}
                </p>
              )}

              <div>
                <label htmlFor="title">Hotel Name</label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter hotel name"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  placeholder="Enter hotel description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="price">Price per night (₹)</label>
                <input
                  id="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter price"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="latitude">Latitude</label>
                <input
                  id="latitude"
                  type="number"
                  min="-90"
                  max="90"
                  step="any"
                  placeholder="e.g. 13.0827"
                  value={latitude}
                  onChange={(event) => setLatitude(event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="longitude">Longitude</label>
                <input
                  id="longitude"
                  type="number"
                  min="-180"
                  max="180"
                  step="any"
                  placeholder="e.g. 80.2707"
                  value={longitude}
                  onChange={(event) => setLongitude(event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="image">
                  Hotel Image (maximum 5 MB)
                </label>

                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {previewImage && (
                <div style={{ margin: "16px 0" }}>
                  <p>Image Preview:</p>

                  <img
                    src={previewImage}
                    alt="Hotel preview"
                    style={{
                      width: "100%",
                      maxWidth: "400px",
                      height: "220px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setImage("");
                      setImageFile(null);
                    }}
                  >
                    Remove Preview
                  </button>
                </div>
              )}

              <button type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : isEditing
                    ? "Update Hotel"
                    : "Save Hotel"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                disabled={saving}
              >
                Cancel
              </button>
            </form>
          </>
        )}
      </main>
    </>
  );
}

export default HotelForm;
