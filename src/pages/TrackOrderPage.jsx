import { useSearchParams } from "react-router-dom";
import TrackOrder from "../components/dashboard/TrackOrder";

// Public order tracking: works without login, using order ID + phone number
export default function TrackOrderPage() {
  const [params] = useSearchParams();

  return (
    <div className="bg-gray-50 min-h-[60vh] py-10 md:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <TrackOrder
          accent="#db2777"
          initialOrderId={params.get("order_id") || ""}
          initialPhone={params.get("phone") || ""}
        />
      </div>
    </div>
  );
}
