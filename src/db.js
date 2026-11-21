import { ref } from 'firebase/database'
import { db } from './firebase'

// Every path this quiz reads or writes lives under one namespace, so it can
// never touch the live "Deals, Data & Decisions" quiz (which uses root paths)
// even though both share the same Firebase project.
export const DB_NAMESPACE = 'dsp'

export const dbRef = (path) => ref(db, `${DB_NAMESPACE}/${path}`)
