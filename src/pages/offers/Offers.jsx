import React from 'react';
import './Offers.css';

const offersData = [
  {
    discount: "15% OFF",
    items: ["Income Tax + GST Return Filing – Save 15% when you book both together."],
    coupon: "FINWISEE"
  },
  {
    discount: "20% OFF",
    items: [
      "Audit + Tax Filing Deal",
      "Book audit services and get 20% off on ITR filing for the same financial year"
    ],
    coupon: "LEARNING"
  },
  {
    discount: "10% OFF",
    items: [
      "Loyalty Discount",
      "Been with us for over a year? Get 10% off on all annual compliance packages."
    ],
    coupon: "PACKAGE"
  },
  {
    discount: "10% OFF",
    items: [
      "Early Bird Offer",
      "File your taxes before 31st August and get 10% cashback or discount."
    ],
    coupon: "BIRD"
  }
];

const Offers = () => {
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon code "${code}" copied to clipboard!`);
  };

  return (
    <div className="offers-container">
      <h1>Latest Offers</h1>
      <div className="offers-grid">
        {offersData.map((offer, index) => (
          <div key={index} className="offer-card">
            <div className="discount">{offer.discount}</div>
            <ul>
              {offer.items.map((item, idx) => (
                <li key={idx}>
                  <input type="checkbox" id={`item-${index}-${idx}`} />
                  <label htmlFor={`item-${index}-${idx}`}>{item}</label>
                </li>
              ))}
            </ul>
            <div className="coupon-code">
              <span>Code: <strong>{offer.coupon}</strong></span>
              <button onClick={() => handleCopy(offer.coupon)}>Use Code</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
