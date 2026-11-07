
import { Link } from "react-router-dom";

function HotelCard({ hotel, onEdit, onDelete }) {
  const description = hotel.description || "";

  const imageSrc = hotel.image
    ? hotel.image.startsWith("http")
      ? hotel.image
      : `http://localhost:5000${hotel.image}`
    : "https://placehold.co/600x400?text=Hotel";

  return (
    <article className="hotel-card">
      <Link
        to={`/hotel/${hotel.id}`}
        aria-label={`View details for ${hotel.title}`}
      >
        <img
  src={imageSrc}
  alt={hotel.title}
  className="hotel-image"
  onError={(e) => {
    console.log("Image failed:", e.currentTarget.src);
    e.currentTarget.src =
      "https://placehold.co/600x400?text=Image+Not+Found";
  }}
/>
      </Link>

      <div className="hotel-content">
        <h2>
          <Link
            to={`/hotel/${hotel.id}`}
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {hotel.title}
          </Link>
        </h2>

        <p className="hotel-price">
          ₹{Number(hotel.price).toLocaleString("en-IN")} / night
        </p>

        <p>
          {description.length > 100
            ? `${description.slice(0, 100)}...`
            : description}
        </p>

        <div className="card-actions">
          <button
            type="button"
            onClick={() => onEdit(hotel.id)}
          >
            View / Edit
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={() => onDelete(hotel.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default HotelCard;
