import "./Features.css";
import { FaShippingFast, FaLock, FaHeadset, FaUndo } from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaShippingFast />,
      title: "Free Shipping",
      description: "Free delivery on orders above ₹999."
    },
    {
      icon: <FaLock />,
      title: "Secure Shopping",
      description: "Your personal information is always protected."
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      description: "Our team is available anytime to help you."
    },
    {
      icon: <FaUndo />,
      title: "Easy Returns",
      description: "7-day hassle-free return policy."
    }
  ];

  return (
    <section className="features">

      <div className="section-title">
        <span>Our Promise</span>
        <h2>Why Choose Us</h2>
        <p>
          We deliver quality products with exceptional service to make every
          shopping experience memorable.
        </p>
      </div>

      <div className="features-grid">
        {features.map((item, index) => (
          <div className="feature-card" key={index}>

            <div className="feature-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.description}</p>

          </div>
        ))}
      </div>

    </section>
  );
};

export default Features;