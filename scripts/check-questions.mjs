// Runs before every build (npm "prebuild"). A malformed question bank fails
// the build, so Render keeps serving the last good version instead.
import { dspQuestions } from '../src/data/dspQuestions.js'
import { validateQuestions } from '../src/questions.js'

const errors = validateQuestions(dspQuestions)
if (errors.length) {
  console.error('\n✗ src/data/dspQuestions.js has problems:\n  - ' + errors.join('\n  - ') + '\n')
  process.exit(1)
}
console.log(`✓ ${dspQuestions.length} questions OK (src/data/dspQuestions.js)`)
