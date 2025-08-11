import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqData = [
  {
    question: "Who is Finwisee?",
    answer:
      "Finwisee is an online Financial planning portal that provides automated, algorithm-based Financial Plan creation & advice. Post Financial Plan creation, our experts can review your information and guide you with right assets and next steps (For Paid plan customers).",
  },
  {
    question: "How do we work?",
    answer:
      "We work by understanding your goals, gathering data, and offering insights through our expert-reviewed algorithms.",
  },
  {
    question: "Tell us more about your Financial Planning algorithms",
    answer:
      "Our algorithms analyze multiple financial metrics and preferences to provide optimized planning tailored to each user's needs.",
  },
  {
    question: "Do you charge any Fees?",
    answer:
      "We offer both free and paid plans. Paid plans include expert review and personalized guidance.",
  },
  {
    question: "Why this Asset Allocation?",
    answer:
      "Asset allocation is based on your financial goals, risk appetite, and investment horizon, ensuring optimized long-term returns.",
  },
   {
    question: "What services does your CA firm provide?",
    answer:
      "We provide a wide range of services including auditing, taxation, GST compliance, income tax filing, company incorporation, payroll processing, financial advisory, and more.",
  },
   {
    question: "Can I file my Income Tax Return (ITR) through your platform?",
    answer:
      "Yes, our platform allows individual and business clients to file their ITRs quickly and securely with the help of our professional chartered accountants.",
  },
  {
    question: "How does the online appointment or consultation system work?",
    answer:
      "You can book a virtual or in-person consultation through our booking system by selecting a service, preferred date/time, and providing basic information.",
  },
  {
    question: "How secure is my financial data on your platform?",
    answer:
      "We use industry-standard data encryption and follow strict privacy protocols to ensure your financial and personal data is safe.",
  },
   {
    question: "Can I track my service status after booking?",
    answer:
      "Yes. Our dashboard allows you to track progress, upload documents, communicate with your CA, and receive timely updates.",
  },
  {
    question: "Do you offer reminders for due dates like GST or ITR filing?",
    answer:
      "Yes. Our platform includes a compliance reminder system that notifies you about upcoming due dates and required actions.",
  },

];

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-[#0f2c4f] font-semibold text-2xl sm:text-3xl text-center">
          Frequently Asked Questions 
        </h1>
        <p className="text-[#0f2c4f] text-xs sm:text-sm font-semibold text-center mt-1 mb-6">
          FAQs On Financial & Investment Management And about CA's Firm Services
        </p>

        <div className="bg-white rounded-md shadow-sm border border-[#e2e8f0]">
          {faqData.map((item, index) => (
            <div key={index} className="border-t first:border-t-0 border-[#e2e8f0]">
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className={`w-full flex justify-between items-center bg-[#d7e7fc] text-[#0f2c4f] text-xs sm:text-sm font-semibold px-4 py-2 focus:outline-none ${
                  index === 0 ? "rounded-t-md" : ""
                }`}
              >
                <span>{item.question}</span>
                {openIndex === index ? <FaMinus /> : <FaPlus />}
              </button>
              {openIndex === index && (
                <div className="px-4 py-3 text-[#6b7280] text-xs sm:text-sm leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQAccordion;
