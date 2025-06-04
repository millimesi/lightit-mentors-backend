/**
 * @description
 * @param {Number} rating - rating given to the mentor
 * @returns {string} - price/hour based on the return range
 */
export default function getPrice(rating) {
  // create rating range
  // range1 include rating <= 3
  if (rating <= 3) {
    return "100 birr/hour for a single mentee";
  }

  // range2 inculde rating > 3 && rating <= 6
  if (3 < rating && rating <= 6) {
    return "150 birr/hour for a single mentee";
  }

  // range3 include rating > 6 && rating <= 9
  if (6 < rating && rating <= 9) {
    return "200 birr/hour for a single mentee";
  }

  // negotaible include rating = 10
  if (rating === 10) {
    return "Will be decied by the mentor";
  }
}
