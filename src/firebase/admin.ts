import 'server-only';
import { initializeApp, getApps, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Uses Application Default Credentials, which Firebase App Hosting / Cloud Run
// provide automatically in production. For local dev, run
// `gcloud auth application-default login` or set GOOGLE_APPLICATION_CREDENTIALS.
function getAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0) return existing[0];
  return initializeApp();
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminFirestore() {
  return getFirestore(getAdminApp());
}

/** Verifies a Firebase ID token and confirms the caller has an entry in roles_admin. Throws if not. */
export async function requireAdmin(idToken: string): Promise<string> {
  const decoded = await getAdminAuth().verifyIdToken(idToken);
  const adminDoc = await getAdminFirestore().collection('roles_admin').doc(decoded.uid).get();
  if (!adminDoc.exists) {
    throw new Error('FORBIDDEN: admin access required');
  }
  return decoded.uid;
}
