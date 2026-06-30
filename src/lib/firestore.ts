import {
  Firestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
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

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorPhoto?: string;
  message: string;
  createdAt: string;
}

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
    department: input.department,
    category: input.category,
    title: input.title,
    message: input.message,
    priority: input.priority,
    isAnonymous: input.isAnonymous,
    status: 'Pending' as Status,
    submittedAt: serverTimestamp(),
  };

  // Identity fields are only ever written for non-anonymous submissions.
  // Anonymous posts must not be traceable back to a student by anyone, admins included.
  if (!input.isAnonymous) {
    docData.studentName = input.studentName ?? '';
    docData.studentRegNo = input.studentRegNo;
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

export async function getSuggestionById(firestore: Firestore, id: string): Promise<Suggestion | null> {
  const ref = doc(firestore, 'suggestions', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  const submittedAt =
    data.submittedAt instanceof Timestamp
      ? data.submittedAt.toDate().toISOString()
      : data.submittedAt ?? new Date().toISOString();
  return {
    id: data.id ?? snap.id,
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
}

export async function addComment(
  firestore: Firestore,
  user: User,
  suggestionId: string,
  message: string
): Promise<string> {
  const commentsRef = collection(firestore, 'suggestions', suggestionId, 'comments');
  const ref = await addDoc(commentsRef, {
    authorId: user.uid,
    authorName: user.displayName ?? 'Student',
    authorEmail: user.email ?? '',
    authorPhoto: user.photoURL ?? null,
    message,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeComments(
  firestore: Firestore,
  suggestionId: string,
  onChange: (comments: Comment[]) => void
): () => void {
  const q = query(
    collection(firestore, 'suggestions', suggestionId, 'comments'),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const comments = snapshot.docs.map((d) => {
      const data = d.data();
      const createdAt =
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt ?? new Date().toISOString();
      return {
        id: d.id,
        authorId: data.authorId,
        authorName: data.authorName,
        authorEmail: data.authorEmail,
        authorPhoto: data.authorPhoto ?? undefined,
        message: data.message,
        createdAt,
      } as Comment;
    });
    onChange(comments);
  });
}
