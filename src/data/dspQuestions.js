// ═════════════════════════════════════════════════════════════════════════
//  Amazon DSP, from zero: Quiz — QUESTION BANK  (the only file to edit)
// ═════════════════════════════════════════════════════════════════════════
//  One object per question, asked in this order:
//    level    – optional difficulty tag shown next to the topic:
//               "Easy", "Medium" or "Hard" (leave it out to hide the tag)
//    topic    – short tag shown in the question header, e.g. "Audiences"
//    question – the question text
//    options  – exactly 4 answers
//    correct  – position of the right answer in `options`: 0 = first … 3 = fourth
//    time     – seconds on the clock
//
//  • Options are shuffled per player automatically — write them in any order.
//  • Scoring: +5 if right within 15 s, +3 if right after that, 0 if wrong,
//    −1 if no answer before time runs out.
//  • You can paste a plain JSON array between the [ ] below.
//  • `npm run build` refuses to build if anything here is malformed, so a bad
//    edit can never reach the live site (run `npm run check:questions` to test).
// ═════════════════════════════════════════════════════════════════════════

export const dspQuestions = [
  {"level":"Easy","topic":"Foundations","question":"How do you pay for Amazon DSP ads?","options":["Per click","Per order","Per 1,000 impressions","A fixed monthly fee"],"correct":2,"time":20},
  {"level":"Easy","topic":"Custom audiences","question":"Which of these is NOT one of the four groups of DSP custom audiences?","options":["Retail","Media","Campaign remarketing","In-market"],"correct":3,"time":20},
  {"level":"Medium","topic":"Goals","question":"On an awareness campaign, who do we exclude to reach new-to-brand shoppers?","options":["People who viewed the product yesterday","Anyone who bought the brand in the last 365 days","People outside the category","Nobody; awareness needs no exclusions"],"correct":1,"time":25},
  {"level":"Medium","topic":"Targeting","question":"What is the biggest difference between Sponsored Ads and DSP targeting?","options":["Sponsored Ads targets searches; DSP targets people by behaviour","DSP only runs on Amazon","Sponsored Ads is only for video","DSP needs keywords"],"correct":0,"time":25},
  {"level":"Hard","topic":"Promoted products","question":"A line item shows Promoted ROAS 1.2 and Total ROAS 3.0. What does that tell you?","options":["The report is double counting","The advertised products sold three times more","Most credited sales are other products of the brand, not the advertised ones","New-to-brand sales are zero"],"correct":2,"time":30},
  {"level":"Hard","topic":"Goals","question":"A new product is launching and nobody knows it yet. Which set-up makes most sense first?","options":["Only remarketing to cart-adders","Lifestyle and in-market audiences on an awareness goal, judged on reach","Only past-buyer audiences","Performance+ conversion only, judged on ROAS"],"correct":1,"time":30}
]
