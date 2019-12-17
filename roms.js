export default {
  Counter: [
    // pc
    1,
    // R[7] + R[8] -> R[8]
    1,
    7,
    8,
    8,
    // 1 -> pc
    2,
    1,
    // data
    1,
    0
  ],
  Fibonacci: [
    // pc
    1,
    // R[14] -> R[15]
    3,
    14,
    15,
    // R[13] + R[14] -> R[14]
    1,
    13,
    14,
    14,
    // R[15] -> R[13]
    3,
    15,
    13,
    // 1 -> pc
    2,
    1,
    // data
    0,
    1,
    0
  ]
};