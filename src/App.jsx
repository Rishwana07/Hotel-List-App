
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HotelList from "./pages/HotelList";
import HotelForm from "./pages/HotelForm";
import HotelDetails from "./pages/HotelDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page: display all hotels */}
        <Route path="/" element={<HotelList />} />

        {/* Add a new hotel */}
        <Route path="/add-hotel" element={<HotelForm />} />

        {/* Edit an existing hotel */}
        <Route path="/edit-hotel/:id" element={<HotelForm />} />

        {/* View complete hotel details */}
        <Route path="/hotel/:id" element={<HotelDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
