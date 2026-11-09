import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface AssessmentSubmissionRecord {
  id?: string;
  studentName: string;
  studentClass: string;
  totalScore: number;
  maxScore: number;
  durationSeconds: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  submittedAt: string;
}

const COLLECTION_NAME = 'assessments';

export async function saveAssessmentToCloud(
  record: Omit<AssessmentSubmissionRecord, 'id'>
): Promise<string> {
  const docId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const docRef = doc(db, COLLECTION_NAME, docId);

  try {
    await setDoc(docRef, {
      studentName: record.studentName.trim(),
      studentClass: record.studentClass.trim(),
      totalScore: Number(record.totalScore),
      maxScore: Number(record.maxScore || 100),
      durationSeconds: Number(record.durationSeconds),
      passed: Boolean(record.passed),
      correctCount: Number(record.correctCount),
      totalQuestions: Number(record.totalQuestions || 15),
      submittedAt: record.submittedAt || new Date().toISOString(),
    });
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${docId}`);
  }
}

export function subscribeToAssessments(
  onData: (items: AssessmentSubmissionRecord[]) => void,
  onError?: (err: any) => void
): () => void {
  const colRef = collection(db, COLLECTION_NAME);

  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      const items: AssessmentSubmissionRecord[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<AssessmentSubmissionRecord, 'id'>),
      }));

      // Sort newest first by submittedAt
      items.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
    }
  );

  return unsubscribe;
}

export async function deleteAssessmentFromCloud(id: string): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getTeacherPinFromCloud(): Promise<string | null> {
  const docRef = doc(db, 'settings', 'teacher_config');
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return (data as any).teacherPin || null;
    }
    return null;
  } catch (error) {
    console.warn('Gagal membaca teacherPin dari Firestore:', error);
    return null;
  }
}

export async function saveTeacherPinToCloud(pin: string): Promise<void> {
  const docRef = doc(db, 'settings', 'teacher_config');
  try {
    await setDoc(docRef, {
      teacherPin: pin.trim(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'settings/teacher_config');
  }
}

