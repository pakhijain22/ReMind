import { checkAdherence } from './adherenceEngine.js';

const log1 = [
  { type: "medicine", weekday: "Sunday", status: "missed" },
  { type: "medicine", weekday: "Sunday", status: "missed" },
  { type: "medicine", weekday: "Monday", status: "done" },
];
// expect 1 flag: medicine missed on Sunday

const log2 = [
  { type: "hydration", weekday: "Tuesday", status: "missed" },
  { type: "hydration", weekday: "Wednesday", status: "missed" },
];
// expect 0 flags: only 1 miss per weekday, not 2+

const log3 = [];
// expect 0 flags: empty log

console.log("Test 1:", checkAdherence(log1)); // should show 1 message
console.log("Test 2:", checkAdherence(log2)); // should show []
console.log("Test 3:", checkAdherence(log3)); // should show []