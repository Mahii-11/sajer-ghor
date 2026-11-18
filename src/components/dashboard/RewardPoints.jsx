import { useMemo, useState } from "react";
import { Gift, Search, Eye, X } from "lucide-react";
import { mockPoints, transactionTypes } from "../../data/mockPoints";

const formatDate = (iso) =>
  new Date(iso)
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "")
    .replace(/\b(am|pm)\b/i, (m) => m.toLowerCase());

export default function RewardPoints() {
  // TODO: dynamic করার সময় এখানে API call বসবে
  const { balance, transactions } = mockPoints;

  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter((t) => {
      const matchType = type === "all" || t.type === type;
      const matchQuery =
        !q ||
        t.typeLabel.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [transactions, query, type]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="pb-4 mb-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900">Your Reward Points</h2>
        <p className="text-sm text-slate-500 mt-1">
          Track and manage your loyalty reward transactions.
        </p>
      </div>

      {/* Balance */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-orange-50 px-5 py-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-[#db2777] flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide text-slate-600 uppercase">
              Final Balance
            </p>
            <p className="text-sm text-slate-500">Reward points</p>
          </div>
        </div>
        <p className="text-3xl font-bold text-[#db2777]">{balance}</p>
      </div>

      {/* History */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-900">Transaction History</h3>
        <p className="text-sm text-slate-500 mt-1">
          {filtered.length} transaction(s) found
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#db2777] focus:ring-4 focus:ring-[#db2777]/10 transition-all"
            />
          </div>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#db2777] focus:ring-4 focus:ring-[#db2777]/10 transition-all"
          >
            {transactionTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-5 py-4 font-semibold">Transaction</th>
                <th className="px-5 py-4 font-semibold">Description</th>
                <th className="px-5 py-4 font-semibold text-right">Points</th>
                <th className="px-5 py-4 font-semibold text-right">Balance After</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-semibold text-slate-900">{t.typeLabel}</td>
                    <td className="px-5 py-4 text-slate-600">{t.description}</td>
                    <td
                      className={`px-5 py-4 text-right font-semibold ${
                        t.points >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.points >= 0 ? `+${t.points}` : t.points}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-slate-900">
                      {t.balanceAfter}
                    </td>
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelected(t)}
                        className="inline-flex items-center gap-1.5 text-[#db2777] hover:underline font-medium"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-lg font-bold text-slate-900">Transaction Details</h4>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <dl className="space-y-3 text-sm">
              {[
                ["Transaction", selected.typeLabel],
                ["Description", selected.description],
                ["Points", selected.points >= 0 ? `+${selected.points}` : selected.points],
                ["Balance After", selected.balanceAfter],
                ["Date", formatDate(selected.date)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="font-medium text-slate-900 text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
