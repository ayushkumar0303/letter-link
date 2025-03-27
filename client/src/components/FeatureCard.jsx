const FeatureCard = ({ title, description }) => (
  <div className="bg-white shadow-md rounded-lg p-6 text-center">
    <h2 className="text-2xl font-semibold">{title}</h2>
    <p className="text-gray-600 mt-2">{description}</p>
  </div>
);

export default FeatureCard;
