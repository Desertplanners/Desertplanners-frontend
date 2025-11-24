import { useSearchParams } from "react-router-dom";
import BookingSuccess from "../../../components/BookingSuccess";
import DashboardHome from "../Dashboard/AdminDashboard";

export default function Admin() {
  const [searchParams] = useSearchParams();

  const tab = searchParams.get("tab");
  const bookingId = searchParams.get("id");

  return (
    <>
      {tab === "bookings" ? (
        <BookingSuccess />
      ) : (
        <DashboardHome />
      )}
    </>
  );
}
