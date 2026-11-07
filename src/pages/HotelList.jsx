
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
  fetchHotels,
  deleteHotel,
} from "../features/hotelsSlice";

import HotelCard from "../components/HotelCard";
import Pagination from "../components/Pagination";

function HotelList() {
  const hotels = useSelector((state) => state.hotels.hotels);
 
  const pagination = useSelector(
    (state) => state.hotels.pagination
  );
  const loading = useSelector(
    (state) => state.hotels.loading
  );
  const error = useSelector(
    (state) => state.hotels.error
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");

  const itemsPerPage = 3;

  // 1. Fetch hotels from PostgreSQL backend
  useEffect(() => {
    dispatch(
      fetchHotels({
        search,
        minPrice,
        maxPrice,
        page,
        limit: itemsPerPage,
      })
    );
  }, [dispatch, search, minPrice, maxPrice, page]);

  // 2. Show success message after adding or updating
  useEffect(() => {
    const successMessage = location.state?.message;

    if (!successMessage) {
      return;
    }

    setMessage(successMessage);

    navigate("/", {
      replace: true,
      state: null,
    });
  }, [location.state, navigate]);

  // 3. Automatically hide success message
  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      setMessage("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [message]);

  // 4. Delete hotel from backend
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hotel?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(deleteHotel(id)).unwrap();

      setMessage("Hotel deleted successfully!");

      // Refresh hotel list after deletion
      const result = await dispatch(
        fetchHotels({
          search,
          minPrice,
          maxPrice,
          page,
          limit: itemsPerPage,
        })
      ).unwrap();

      // If current page becomes empty, go to previous page
      if (result.hotels.length === 0 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      setMessage(error || "Unable to delete hotel.");
    }
  }

  const totalPages = Math.max(
    pagination.totalPages || 0,
    1
  );

  const currentPage = pagination.currentPage || page;

  return (
    <>
      <Helmet>
        <title>Hotel Management System | Hotels</title>
        <meta
          name="description"
          content="Browse, search, add, edit and manage hotels."
        />
      </Helmet>

      <main className="container">
        <header className="page-header">
          <h1>Hotel Management System</h1>
          <p>Discover and manage your hotels</p>

          <button
            type="button"
            onClick={() => navigate("/add-hotel")}
          >
            + Add Hotel
          </button>
        </header>

        {/* Success message */}
        {message && (
          <div
            className="success-message"
            role="status"
            aria-live="polite"
          >
            {message}
          </div>
        )}

        {/* Search and price filters */}
        <section className="filters">
          <input
            type="search"
            placeholder="Search hotel by title..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            aria-label="Search hotels by title"
          />

          <input
            type="number"
            min="0"
            placeholder="Minimum price"
            value={minPrice}
            onChange={(event) => {
              setMinPrice(event.target.value);
              setPage(1);
            }}
            aria-label="Minimum hotel price"
          />

          <input
            type="number"
            min="0"
            placeholder="Maximum price"
            value={maxPrice}
            onChange={(event) => {
              setMaxPrice(event.target.value);
              setPage(1);
            }}
            aria-label="Maximum hotel price"
          />
        </section>

        {/* Loading message */}
        {loading && (
          <p className="empty-message">
            Loading hotels...
          </p>
        )}

        {/* API error */}
        {error && (
          <p className="empty-message">
            {error}
          </p>
        )}

        {/* Hotel cards */}
        {!loading && !error && (
          <section className="hotel-grid">
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onEdit={(id) =>
                  navigate(`/edit-hotel/${id}`)
                }
                onDelete={handleDelete}
              />
            ))}
          </section>
        )}

        {/* No results */}
        {!loading && !error && hotels.length === 0 && (
          <p className="empty-message">
            No hotels found.
          </p>
        )}

        {/* Pagination */}
        {!loading && hotels.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </main>
    </>
  );
}

export default HotelList;
