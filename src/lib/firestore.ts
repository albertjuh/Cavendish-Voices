import {
  Firestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import type { Suggestion, Category, Priority, Status } from './mock-data';

export interface CreateSuggestionInput {
  studentName?: string;
  studentRegNo: string;
  department: string;
  category: Category;
  title: string;
  message: string;
  priority: Priority;
  isAnonymous: boolean;
}

function snapshotToSuggestions(snapshot: QuerySnapshot<DocumentData>): Suggestion[] {
  return snapshot.docs.map((d) => {
    const data = d.data();
    const submittedAt =
      data.submittedAt instanceof Timestamp
        ? data.submittedAt.toDate().toISOString()
        : data.submittedAt ?? new Date().toISOString();
    return {
      id: data.id ?? d.id,
      studentName: data.studentName,
      studentRegNo: data.studentRegNo,
      department: data.department,
      category: data.category,
      title: data.title,
      message: data.message,
      priority: data.priority,
      isAnonymous: data.isAnonymous,
      submittedAt,
      status: data.status ?? 'Pending',
    } as Suggestion;
  });
}

export async function createSuggestion(
  firestore: Firestore,
  user: User,
  input: CreateSuggestionInput
): Promise<string> {
  const ref = doc(collection(firestore, 'suggestions'));
  const docData: Record<string, unknown> = {
    id: ref.id,
    studentRegNo: input.studentRegNo,
    department: input.department,
    category: input.category,
    title: input.title,
    message: input.message,
    priority: input.priority,
    isAnonymous: input.isAnonymous,
    status: 'Pending' as Status,
    submittedAt: serverTimestamp(),
  };

  if (!input.isAnonymous) {
    docData.studentName = input.studentName ?? '';
    docData.ownerId = user.uid;
  }

  await setDoc(ref, docData);
  return ref.id;
}

export async function getSuggestions(firestore: Firestore): Promise<Suggestion[]> {
  const q = query(collection(firestore, 'suggestions'), orderBy('submittedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshotToSuggestions(snapshot);
}

export function subscribeSuggestions(
  firestore: Firestore,
  onChange: (suggestions: Suggestion[]) => void
): () => void {
  const q = query(collection(firestore, 'suggestions'), orderBy('submittedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    onChange(snapshotToSuggestions(snapshot));
  });
}

export async function updateSuggestionStatus(
  firestore: Firestore,
  id: string,
  status: Status
): Promise<void> {
  const ref = doc(firestore, 'suggestions', id);
  await updateDoc(ref, { status });
}

export async function deleteSuggestion(firestore: Firestore, id: string): Promise<void> {
  const ref = doc(firestore, 'suggestions', id);
  await deleteDoc(ref);
}
