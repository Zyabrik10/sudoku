export default function doesHaveInside(arr, sub_arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][0] === sub_arr[0] && arr[i][1] === sub_arr[1]) return true;
  }
  return false;
}
