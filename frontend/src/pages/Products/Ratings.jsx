import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text }) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  // Determine if stars should be colored
  const isRated = value > 0;
  const starColor = isRated ? "text-yellow-400" : "text-gray-500";

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={`full-${index}`} className={`${starColor} ml-1`} />
      ))}
      {halfStars === 1 && <FaStarHalfAlt className={`${starColor} ml-1`} />}
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={`empty-${index}`} className={`${starColor} ml-1`} />
      ))}
      {text && (
        <span className="ml-2 text-white text-sm">
          {text}
        </span>
      )}
    </div>
  );
};

export default Ratings;
