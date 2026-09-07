import Avatar from "../../assets/avators";
import { Reply } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("https://easybrand.onrender.com/api/booking", {
        withCredentials: true,
      });
      setBookings(response.data.bookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Unable to load bookings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div class="flex items-center justify-center h-screen">
  <div class="w-7 h-7 border-[2.5px] border-black/10 border-t-black/60 rounded-full animate-spin"></div>
</div>
  }

  if (error) {
    return <div class="flex items-center justify-center h-screen">{error}</div>;
  }
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all booking requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 ">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">All Bookings ({bookings.length})</p>
        </div>

        {/* Desktop / tablet: table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Billing</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={b.fullName} size="w-8 h-8" />
                      <div>
                        <p className="text-gray-900 font-medium">{b.fullName}</p>
                        <p className="text-gray-400 text-xs">{b.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-gray-700 capitalize">{b.plan}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 capitalize">{b.billing}</td>
                  <td className="px-5 py-3.5 text-gray-900 font-medium">${b.price}</td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(b.email)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-lg w-30 h-10 text-[10px] text-gray-700 hover:text-gray-900"
                      title="Reply"
                    >
                      <Reply size={20} />
                      reply
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {bookings.map((b) => (
            <div key={b._id} className="px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={b.fullName} size="w-9 h-9" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium truncate">{b.fullName}</p>
                  <p className="text-gray-400 text-xs truncate">{b.email}</p>
                </div>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(b.email)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-5 h-5 text-[10px] text-gray-700 hover:text-gray-900"
                  title="Reply"
                >
                  <Reply size={20} />
                </a>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div>
                  <p className="text-gray-400 mb-0.5">Plan</p>
                  <p className="text-gray-700 capitalize">{b.plan}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Billing</p>
                  <p className="text-gray-700 capitalize">{b.billing}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Price</p>
                  <p className="text-gray-900 font-medium">${b.price}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Date</p>
                  <p className="text-gray-700">{new Date(b.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookingsPage;