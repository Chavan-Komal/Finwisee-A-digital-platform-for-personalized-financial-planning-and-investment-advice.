import React from "react";
import "./affiliations.css";

const affiliationsData = [
  {
    title: "Forum of Firms",
    imgSrc:
      "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ab1ef255-e659-4167-a2a9-fe94b7bce1d3.png",
    altText: "Forum of Firms logo",
    description:
      "Finwisee is a member of the Forum of Firms – an international association promoting high-quality audit practices globally.",
  },
  {
    title: "ICAI",
    imgSrc:
      "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/fa0a0b41-2f00-4eb1-bbaa-145d1911b420.png",
    altText: "ICAI Chartered Accountants of India logo",
    description:
      "We provide articleship opportunities for CA students registered with ICAI – the world’s second largest professional body of Chartered Accountants.",
  },
  {
    title: "ICAEW",
    imgSrc:
      "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c11a5ca0-3ed6-48fd-8eaa-812bf188e58e.png",
    altText: "ICAEW Partner in Learning logo",
    description:
      "As an ICAEW affiliate, we uphold the highest professional, technical, and ethical standards to support auditor development.",
  },
  {
    title: "ACCA",
    imgSrc:
      "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/efcedc43-e7c1-4675-947a-9b1b10c74983.png",
    altText: "ACCA Think Ahead logo",
    description:
      "We are an ACCA Approved Employer, guiding trainees toward achieving their ACCA qualification with expert mentorship.",
  },
];

const Affiliations = () => {
  return (
    <div className="container affiliations-container py-5">
      <h2 className="mb-5 text-center fw-bold">Our Affiliations</h2>
      <div className="row g-4 justify-content-center">
        {affiliationsData.map((item, index) => (
          <div
            key={index}
            className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch"
          >
            <div className="card affiliation-card p-3 border-0 shadow-sm w-100 text-center">
              <img
                src={item.imgSrc}
                alt={item.altText}
                className="affiliation-logo d-block mx-auto mb-3"
              />
              <h5 className="card-title mb-2">{item.title}</h5>
              <p className="card-text">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Affiliations;
