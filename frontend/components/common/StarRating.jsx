import ReactStars from "react-rating-stars-component";
export function StarRating({ rating, edit = false, isShowTitle = false,isHalf=true ,onRatingChange }) {
  return (
    <div className="star_rating_container">
      {isShowTitle ? <p className="mid_text">Rating:</p> : null}

      <ReactStars
        count={5}
        value={rating}
        isHalf={isHalf}
        edit={edit}
        size={24}
        color="#bfbfbf"
        activeColor="#ffd700"
        onChange={(newrating) => {
          
          if (typeof onRatingChange === "function") {
            onRatingChange(newrating);
          }
        }}
      />
    </div>
  );
}
