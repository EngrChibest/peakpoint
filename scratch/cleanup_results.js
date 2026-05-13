
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './src/firebase.js';

async function cleanupOrphanResults() {
  console.log("Starting Institutional Data Cleanup...");
  try {
    const resultsRef = collection(db, 'results');
    const snap = await getDocs(resultsRef);
    
    let deletedCount = 0;
    for (const d of snap.docs) {
      const data = d.data();
      // If result has no term, it's orphan data
      if (!data.term) {
        console.log(`Deleting orphan record: ${d.id} (Student: ${data.studentId}, Subject: ${data.subject})`);
        await deleteDoc(doc(db, 'results', d.id));
        deletedCount++;
      }
    }
    
    console.log(`Cleanup complete. Removed ${deletedCount} orphan records.`);
  } catch (err) {
    console.error("Cleanup error:", err);
  }
}

cleanupOrphanResults();
