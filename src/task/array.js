function createSpiralMatrix(n) {
  const matr = Array.from({ length: n }, (_) => new Array(n).fill(-0));
  let count = 1;
  let left = 0;
  let right = n - 1;
  let top = 0;
  let bottom = n - 1;

  /**
   * top - - - - - -
   *  |             |
   * left - - - - right
   *  |             |
   * bottom - - - - -
   */

  while (left <= right) {
    for (let i = left; i <= right; ++i) {
      matr[top][i] = count++;
    }
    top += 1;

    for (let j = top; j <= bottom; ++j) {
      matr[j][right] = count++;
    }
    right -= 1;

    for (let k = right; k >= left; --k) {
      matr[bottom][k] = count++;
    }
    bottom -= 1;

    for (let l = bottom; l >= top; --l) {
      matr[l][left] = count++;
    }
    left += 1;
  }

  return matr;
}

function subsets(nums) {
  let result = [];
  if (nums.length == 0) {
    return result;
  }

  function bt(start, curr, nums) {
    result.push([...curr]);

    for (let i = start; i < nums.length; ++i) {
      if (i > start && nums[i - 1] == nums[i]) {
        continue;
      }
      curr.push(nums[i]);
      bt(i + 1, curr, nums);
      curr.pop();
    }
  }

  nums.sort((a, b) => a - b);
  bt(0, [], nums);
  return result;
}
