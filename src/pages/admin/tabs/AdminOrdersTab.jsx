import { api } from '../../../api/client';
import { EmptyState, StatusBadge } from '../../../components/Dashboard/ui';
import { formatCurrency, formatDateTime, fullName, humanize } from '../../../utils/format';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED'];

const AdminOrdersTab = ({ data, reload, notify }) => {
  const updateStatus = async (order, status) => {
    try {
      await api.put(`/orders/${order.id}/status?status=${status}`);
      await reload('orders');
      notify(`Order ${order.orderNumber} marked ${humanize(status).toLowerCase()}`);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  return (
    <div className="fw-card">
      <div className="fw-card-header">
        <h3>All orders ({data.orders.length})</h3>
        <span className="fw-muted">Total revenue: <span className="fw-strong text-success">{formatCurrency(data.stats?.orders?.revenue)}</span></span>
      </div>
      {data.orders.length === 0 ? (
        <EmptyState icon="fa-receipt" title="No orders yet" text="Orders placed from the pricing page appear here." />
      ) : (
        <div className="fw-table-wrap">
          <table className="fw-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Client</th>
                <th>Services</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.orders.map((o) => (
                <tr key={o.id}>
                  <td><div className="fw-strong">{o.orderNumber}</div><div className="fw-muted fw-small">{formatDateTime(o.createdAt)}</div></td>
                  <td>{fullName(o.user)}<div className="fw-muted fw-small">{o.user?.email}</div></td>
                  <td>{o.notes}</td>
                  <td className="fw-strong">{formatCurrency(o.finalAmount)}</td>
                  <td><StatusBadge status={o.paymentStatus} /><div className="fw-muted fw-small">{humanize(o.paymentMethod)}</div></td>
                  <td>
                    <select className="fw-input inline" value={o.orderStatus} onChange={(e) => updateStatus(o, e.target.value)}
                      aria-label={`Status for ${o.orderNumber}`}>
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersTab;
