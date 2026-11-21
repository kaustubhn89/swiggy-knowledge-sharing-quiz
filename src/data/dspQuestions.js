// ═════════════════════════════════════════════════════════════════════════
//  Amazon DSP, from zero: Quiz — QUESTION BANK  (the only file to edit)
// ═════════════════════════════════════════════════════════════════════════
//  One object per question, asked in this order:
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
  {"topic":"Foundations","question":"What does DSP stand for?","options":["Digital Sales Platform","Demand-Side Platform","Data Sharing Program","Display Search Product"],"correct":1,"time":20},
  {"topic":"Campaign structure","question":"What are the three levels of a DSP campaign, top to bottom?","options":["Campaign > Keyword > Ad","Order > Line item > Creative","Portfolio > Ad group > Target","Account > Order > Placement"],"correct":1,"time":20},
  {"topic":"Goals","question":"Which goal is judged on detail page views and cost per DPV?","options":["Awareness","Consideration","Conversion","Retention"],"correct":1,"time":20},
  {"topic":"Audiences","question":"In-market or lifestyle: which suits awareness better?","options":["In-market: smaller and more recent","Lifestyle: larger, stable and cheaper","Both are identical","Neither can be used for awareness"],"correct":1,"time":20},
  {"topic":"Reporting","question":"A shopper sees the ad and buys a different product of the same brand on day 9. How is it credited?","options":["Promoted","Halo","Not credited","New-to-brand only"],"correct":1,"time":20}
]
