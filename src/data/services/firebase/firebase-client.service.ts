import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, getAuth } from 'firebase/auth';
import * as client from 'firebase/app';

@Injectable()
export class FirebaseClientService implements OnModuleInit {
  constructor(private configService: ConfigService) {}
  private firebaseClient: client.FirebaseApp;

  async onModuleInit() {
    const firebaseConfig = {
      apiKey: this.configService.get<string>('API_KEY'),
      authDomain: this.configService.get<string>('AUTH_DOMAIN'),
      projectId: this.configService.get<string>('PROJECT_ID'),
    };

    this.firebaseClient = await client.initializeApp(firebaseConfig);
  }

  /**
   * Get the initialized Firebase app instance
   */
  getApp(): client.FirebaseApp {
    return this.firebaseClient;
  }

  /**
   * Get a specific Firebase service
   */
  getAuth(): Auth {
    return getAuth(this.firebaseClient);
  }
}
