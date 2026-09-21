import { Link } from 'react-router-dom';
import { EmptyState, StatusBadge } from '../../../components/Dashboard/ui';
import { formatCurrency, formatDateTime, humanize } from '../../../utils/format';

const OrdersTab = ({ data }) => (
  <div className="fw-card">
    <div className="fw-card-header">
      <h3>Purchase history</h3>
      <Link to="/home/pricing" className="fw-btn fw-btn-light">
        <i className="fas fa-tags"></i> Browse plans
      </Link>
    </div>
    {data.orders.length === 0 ? (
      <EmptyState icon="fa-receipt" title="No purchases yet" text="Explore our advisory plans and model portfolios." />
    ) : (
      <div className="fw-table-wrap">
        <table className="fw-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Services</th>
              <th>Date</th>
              <th>Payment</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.orders.map((o) => (
              <tr key={o.id}>
                <td className="fw-strong">{o.orderNumber}</td>
                <td>{o.notes}</td>
                <td className="fw-muted">{formatDateTime(o.createdAt)}</td>
                <td>{humanize(o.paymentMethod)}</td>
                <td>
                  <div className="fw-strong">{formatCurrency(o.finalAmount)}</div>
                  {Number(o.discountAmount) > 0 && <div className="text-success fw-small">Saved {formatCurrency(o.discountAmount)}</div>}
                </td>
                <td><StatusBadge status={o.orderStatus} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default OrdersTab;
