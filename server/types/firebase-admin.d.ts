declare module 'firebase-admin/app' {
  export interface AppOptions {
    credential: any;
    projectId?: string;
    storageBucket?: string;
    databaseURL?: string;
  }

  export function initializeApp(options?: AppOptions, name?: string): any;
  export function cert(serviceAccountPathOrObject: string | object): any;
}

declare module 'firebase-admin/auth' {
  export interface DecodedIdToken {
    uid: string;
    email?: string;
    name?: string;
    picture?: string;
  }

  export function getAuth(): {
    verifyIdToken(token: string): Promise<DecodedIdToken>;
  };
} 