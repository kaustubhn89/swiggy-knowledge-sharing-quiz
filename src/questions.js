// ── Deals, Data & Decisions — question bank ────────────────────────────
// Author questions as option ARRAYS with a 0-based `correctIndex`.
// At load time each question's options are shuffled with a deterministic
// seed (derived from the question id), so:
//   • the correct answer lands in a varied slot instead of always "B", and
//   • every player and the admin see the *same* order (needed for the
//     admin's answer-distribution chart and the reveal screen).
// Change SHUFFLE_SEED to re-deal every question.

const RAW = [
  {
    id: 1, time: 20, correctIndex: 1,
    text: "In Market Basket Analysis, what does 'Combination %' mean?",
    options: [
      "% of your customers who ever bought both items",
      "% of orders with your ASIN that also had the other item",
      "% of the other item's sales that came from you",
      "Click share of the other item"
    ]
  },
  {
    id: 2, time: 20, correctIndex: 1,
    text: "SQP, benzoyl peroxide facewash: 10% impression share but 5% click share. Likely fix?",
    options: [
      "Increase the daily budget",
      "Improve main image, title and price appeal",
      "Send more stock to FBA",
      "Lower the bids"
    ]
  },
  {
    id: 3, time: 20, correctIndex: 1,
    text: "Which promotion is best for increasing order value (basket size)?",
    options: ["Lightning Deal", "Buy X Get Y / combo", "Coupon", "Prime Exclusive Discount"]
  },
  {
    id: 4, time: 30, correctIndex: 3,
    text: "₹999 product, ₹300 profit/unit, 20% off. To keep the same profit you need…",
    options: ["1.2× the units", "1.5× the units", "2× the units", "3× the units"]
  },
  {
    id: 5, time: 20, correctIndex: 0,
    text: "Lightning Deal fee on our Amazon.in account (Sept 2026 create screen)?",
    options: ["₹0 + 0% of sales", "₹6,000 per deal", "$70/day + 1% of sales", "2.5% of deal sales"]
  },
  {
    id: 6, time: 20, correctIndex: 1,
    text: "On Amazon.in, a coupon's discount must be between…",
    options: ["1% and 25%", "5% and 50%", "10% and 60%", "20% and 80%"]
  },
  {
    id: 7, time: 20, correctIndex: 1,
    text: "The 'was price' Amazon uses is based on…",
    options: [
      "The M.R.P. printed on the pack",
      "The 90-day median price customers paid",
      "The lowest competitor price",
      "The highest price in the last 30 days"
    ]
  },
  {
    id: 8, time: 20, correctIndex: 1,
    text: "10ml moisturizer buyers often add a rival's face wash to the cart. Best move?",
    options: [
      "Ignore it, not our brand",
      "Pair our mini face wash + target that ASIN",
      "Pause moisturizer ads",
      "Raise the moisturizer price"
    ]
  },
  {
    id: 9, time: 20, correctIndex: 2,
    text: "Pimple patch → table lamp at 11.11%, from 18 orders. What's the right read?",
    options: [
      "Bundle patches with lamps",
      "Target lamp ASINs with ads",
      "Tiny base (2 orders): treat as noise",
      "Launch a skincare lamp"
    ]
  },
  {
    id: 10, time: 20, correctIndex: 0,
    text: "'solved sunscreen' (our own brand term): only 24% impression share. Signal?",
    options: [
      "Competitors are capturing our brand searches",
      "Our listing is suppressed",
      "Search volume data is wrong",
      "Nothing, this is normal"
    ]
  }
]

const SHUFFLE_SEED = 20260930
const LETTERS = ['A', 'B', 'C', 'D']

// mulberry32 — tiny seeded PRNG; identical sequence on every client
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6D2B79F5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seededShuffle(arr, seed) {
  const out = arr.slice()
  const next = rng(seed)
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// App-facing shape (unchanged from before): { id, text, options: {A,B,C,D}, correct: 'A'|'B'|'C'|'D', time }
export const questions = RAW.map(q => {
  const order   = seededShuffle(q.options.map((_, i) => i), SHUFFLE_SEED * 31 + q.id)
  const options = {}
  let correct   = 'A'
  order.forEach((origIdx, slot) => {
    options[LETTERS[slot]] = q.options[origIdx]
    if (origIdx === q.correctIndex) correct = LETTERS[slot]
  })
  return { id: q.id, text: q.text, options, correct, time: q.time }
})
