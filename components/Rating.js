import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';

const Rating = ({ value, text }) => {
  return (
    <div className="flex gap-1">
      <span className="text-yellow-400">
        {value >= 1 ? (
          <IoStar />
        ) : value >= 0.5 ? (
          <IoStarHalf />
        ) : (
          <IoStarOutline />
        )}
      </span>
      <span className="text-yellow-400">
        {value >= 2 ? (
          <IoStar />
        ) : value >= 1.5 ? (
          <IoStarHalf />
        ) : (
          <IoStarOutline />
        )}
      </span>
      <span className="text-yellow-400">
        {value >= 3 ? (
          <IoStar />
        ) : value >= 2.5 ? (
          <IoStarHalf />
        ) : (
          <IoStarOutline />
        )}
      </span>
      <span className="text-yellow-400">
        {value >= 4 ? (
          <IoStar />
        ) : value >= 3.5 ? (
          <IoStarHalf />
        ) : (
          <IoStarOutline />
        )}
      </span>
      <span className="text-yellow-400">
        {value >= 5 ? (
          <IoStar />
        ) : value >= 4.5 ? (
          <IoStarHalf />
        ) : (
          <IoStarOutline />
        )}
      </span>
      <span>{text && text}</span>
    </div>
  );
};

export default Rating;
