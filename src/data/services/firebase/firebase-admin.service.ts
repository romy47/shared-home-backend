import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  constructor(private configService: ConfigService) {}
  private firebaseApp: admin.app.App;

  async onModuleInit() {
    const firebaseConfig = {
      type: this.configService.get<string>('TYPE'),
      project_id: this.configService.get<string>('PROJECT_ID'),
      private_key_id: this.configService.get<string>('PRIVATE_KEY_ID'),
      private_key: this.configService.get<string>('PRIVATE_KEY'),
      client_email: this.configService.get<string>('CLIENT_EMAIL'),
      client_id: this.configService.get<string>('CLIENT_ID'),
      auth_uri: this.configService.get<string>('AUTH_URI'),
      token_uri: this.configService.get<string>('TOKEN_URI'),
      auth_provider_x509_cert_url:
        this.configService.get<string>('AUTH_CERT_URL'),
      client_x509_cert_url: this.configService.get<string>('CLIENT_CERT_URL'),
      universe_domain: this.configService.get<string>('UNIVERSAL_DOMAIN'),
    } as admin.ServiceAccount;

    if (!admin.apps.length) {
      this.firebaseApp = await admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
      });
    }
  }

  /**
   * Get the initialized Firebase app instance
   */
  getApp(): admin.app.App {
    return this.firebaseApp;
  }

  /**
   * Get a specific Firebase service
   */
  getAuth(): admin.auth.Auth {
    return this.firebaseApp.auth();
  }

  getFirestore(): admin.firestore.Firestore {
    return this.firebaseApp.firestore();
  }

  getStorage(): admin.storage.Storage {
    return this.firebaseApp.storage();
  }

  /**
   * Example: Verify Firebase ID token
   */
  async verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
    return this.firebaseApp.auth().verifyIdToken(token);
  }
}
