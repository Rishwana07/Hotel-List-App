
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://hotel-list-app.onrender.com/api/hotels";
// 1. Fetch all hotels from backend
export const fetchHotels = createAsyncThunk(
  "hotels/fetchHotels",
  async (params = {}) => {
    const query = new URLSearchParams(params).toString();

    const response = await fetch(`${API_URL}?${query}`);

    if (!response.ok) {
      throw new Error("Failed to fetch hotels");
    }

    return response.json();
  }
);

// 2. Add a new hotel
export const addHotel = createAsyncThunk(
  "hotels/addHotel",
  async (formData) => {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add hotel");
    }

    return response.json();
  }
);

// 3. Update an existing hotel
export const updateHotel = createAsyncThunk(
  "hotels/updateHotel",
  async ({ id, formData }) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update hotel");
    }

    return response.json();
  }
);

// 4. Delete a hotel
export const deleteHotel = createAsyncThunk(
  "hotels/deleteHotel",
  async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete hotel");
    }

    return id;
  }
);

// Initial Redux state
const initialState = {
  hotels: [],
  pagination: {
    totalHotels: 0,
    currentPage: 1,
    totalPages: 0,
    limit: 3,
  },
  loading: false,
  error: null,
};

const hotelsSlice = createSlice({
  name: "hotels",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Fetch hotels
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload.hotels;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add hotel
      .addCase(addHotel.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(addHotel.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Update hotel
      .addCase(updateHotel.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Delete hotel
      .addCase(deleteHotel.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default hotelsSlice.reducer;
