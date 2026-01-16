import { Package, Clock } from "lucide-react";

export default function OrderTable({ orders }) {
  if (orders.length === 0) {
    return <div className="p-8 text-center text-slate-500">No orders placed yet.</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
          <tr>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Items</th>
            <th className="px-6 py-4">Total</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-slate-50/50">
              <td className="px-6 py-4 font-medium text-slate-900">{order.customerName}</td>
              <td className="px-6 py-4">
                <div className="text-sm text-slate-600">
                  {order.items.map(i => (
                    <div key={i.productId} className="flex gap-2">
                       <span>{i.quantity}x</span> <span className="font-medium">{i.productName}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-slate-700">${order.totalPrice}</td>
              <td className="px-6 py-4 text-sm text-slate-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                  <Clock size={12} /> Pending
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}