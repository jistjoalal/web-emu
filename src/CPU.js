export default function CPU(mem, int) {
  let pc = mem[0];
  let op = mem[int(pc)];
  let a = mem[int(pc + 1)];
  let b = mem[int(pc + 2)];
  let c = mem[int(pc + 3)];
  if (op == 1) {
    // add
    return {
      [c]: int(mem[a] + mem[b]),
      0: int(mem[0] + 4)
    };
  } else if (op == 2) {
    // jump to
    return {
      0: int(a)
    };
  } else if (op == 3) {
    // copy
    return {
      [b]: mem[a],
      0: int(mem[0] + 3)
    };
  }
  return {};
}
