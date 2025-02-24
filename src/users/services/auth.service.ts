import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/data/services/prisma/prisma.service';
import { User } from '@prisma/client';
import { FirebaseClientService } from 'src/data/services/firebase/firebase-client.service';
import { loginDto, SignupDto } from '../dto/auth.dto';
import { FirebaseAdminService } from 'src/data/services/firebase/firebase-admin.service';
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private firebaseClientService: FirebaseClientService,
    private firebaseAdminService: FirebaseAdminService,
  ) {}
  async signup(signupDto: SignupDto): Promise<User> {
    // Check if the user already exists
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: signupDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    console.log(signupDto);
    const auth = this.firebaseClientService.getAuth();
    const firebaseUser = await createUserWithEmailAndPassword(
      auth,
      signupDto.email,
      signupDto.password,
    )
      .then(async function (userResponse) {
        console.log('User successfully created:', userResponse.user.uid);
        await sendEmailVerification(userResponse.user);
        return userResponse.user;
      })
      .then(function (user) {
        console.log('Email verification email successfully sent!');
        return user;
      });

    const user = await this.prismaService.user.create({
      data: {
        auth_id: firebaseUser.uid,
        email: firebaseUser.email,
        first_name: firebaseUser.displayName?.split(' ')[0],
        last_name: firebaseUser.displayName?.split(' ')[1] || '',
      },
    });
    return user;
  }
  async login(loginDto: loginDto): Promise<string> {
    // Check if the user already exists
    const auth = this.firebaseClientService.getAuth();
    await signInWithEmailAndPassword(auth, loginDto.email, loginDto.password);
    return await this.firebaseClientService.getAuth().currentUser.getIdToken();
  }
}
