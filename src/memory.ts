const vv = 10;
if (!Memory.i) Memory.i = []
export const test = () => {
  console.log(`Mem tick ${Memory.i.length} ${vv}`);
  Memory.i.push('s'.repeat(100))
};

export const v = 10;
