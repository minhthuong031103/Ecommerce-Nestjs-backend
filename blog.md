Cách dùng NestJS+ Graphql+ Docker+ Prisma+ PostgresQL

#Khởi tạo nest:

> nest new ./
> Dùng npm

- xóa controller, service, spec

> $ npm i @nestjs/graphql @nestjs/apollo @apollo/server graphql

- thêm Graphql vào phầm app.module

```ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
  ],
})
export class AppModule {}
```

- Giờ cài prisma

> npm prisma –save-dev @prisma/client
> npx prisma init

- init sẽ tạo ra một schema và .env

```ts
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User{
  id Int @id @default(autoincrement())
  name String
  email String
  hashedPassword String
  hashedRefreshToken String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

- Tạo docker-compose.yaml

```ts
services:
  postgres:
    image: postgres
    restart: always
    env_file:
      - .env
    environment:
      - POSTGRES_USER='postgres'
      - POSTGRES_PASSWORD='minhno123'
      - POSTGRES_DB='postgres'
    volumes:
      - postgres:/var/lib/postgresql/data
    ports:
      - '5432:5432'

volumes:
  postgres:
```

Sửa file env

```ts
DATABASE_URL =
  'postgresql://postgres:minhno123@localhost:5432/postgres?schema=public';
```



- Tiến hành chạy docker

> docker compose up -d

- Xong rồi giờ có thể chạy prisma

> npx prisma migrate dev --name init

- Giờ chạy nest vẫn chưa được vì chưa có query root

=>

> nest g resource auth
> chọn Graphql code first

nó tạo 3 file
module, resolver, service
Và 1 file auth.entity, 2 DTO cho createInput và updateInput của thằng resolver

- lúc này đã có thể chạy

> npm run start:dev
> Vì nó đã có query root

- Tạo prisma module

```ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

- prisma.service

```ts
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
```

- giờ tạo DTO cho thằng signJWT-response

```ts
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/user.entity';

@ObjectType()
export class SignResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}
```

- Hiện tại thì chưa có User entity
  > =>tạo module user, bên trong đó tạo thêm user.entity.ts

```ts
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;
}
```

- Quay lại cái DTO, giờ add validation vô luôn, dùng class-validator

  > npm i class-validator class-transformer

- sửa createInput thành signUpInput

```ts
import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
@InputType()
export class SignUpInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}
```

- Để validation chạy được

vào main.ts

> app.useGlobalPipe(new ValidationPipe()) //ValidationPipe import từ @nestjs/common

> nãy đổi createeinput nên nhớ đổi import lại trong update input và đổi các tên trong auth.resolver và auth.service

> Khi chạy thì file schema.gql tự generate các @ObjectType và @InputType

- sửa resolver auth

```ts
  @Mutation(() => SignResponse)
  signup(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.create(signUpInput);
  }
```

Mở playground GraphQL, viết từng lệnh cho 3 mutations SignUp, SignIn, Logout

![image](https://github.com/minhthuong031103/minhthuong-blog/assets/101078033/f204bd8b-0633-4d55-90c9-03607abcb467)
![image](https://github.com/minhthuong031103/minhthuong-blog/assets/101078033/3bed2128-47d1-4598-b7a3-d7ed74482d24)
![image](https://github.com/minhthuong031103/minhthuong-blog/assets/101078033/0ed7f9f7-fc22-47d2-9827-d4e422b07c7d)

> input là query variable, chạy mutation => nó bỏ input vào mutation, sau đó bỏ input vào hàm signup (signUpInput: \$input) và signin(signInInput: $input) tương ứng với @mutation đã được định nghĩa trong resolver

- Cài @nestjs/config

> npm i @nestjs/config

- Config trong app.module

```ts
imports:[
   ConfigModule.forRoot({ isGlobal: true }),
...]
```

> npm i @nestjs/jwt

- Bỏ JWT Service vào providers của auth.module, bỏ luôn Prisma vào để lát dùng trong auth.service

```ts
  imports: [PrismaModule],
  providers: [AuthResolver, AuthService, JwtService],
```

Inject 2 thằng prisma, jwt vào auth.service và thằng configService luôn

```ts
@Injectable
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

```

> npm i argon2
> Mã hóa mật khẩu

- type Input của signIn và signUp và type response của Logout

```ts
export class SignUpInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}
export class SignInInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}
export class LogoutResponse {
  loggedOut: boolean;
}
```

- Xử lý 3 hàm signin signup và logout trong resolver

```ts
@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignResponse)
  signup(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signup(signUpInput);
  }

  @Mutation(() => SignResponse)
  signin(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signin(signInInput);
  }

  @Mutation(() => LogoutResponse)
  logout(@Args('id', { type: () => Int }) id: number) {
    //Int là type trong Graphql
    return this.authService.logout(id);
  }
}
```

- Vì thằng Login và Logout là nó thay đổi refreshToken trong database nên là nó ở dạng Mutation chứ không phải query

trong auth.service, viết các hàm sau

```ts
import { Injectable } from '@nestjs/common';

import { UpdateAuthInput } from './dto/update-auth.input';
import { SignUpInput } from './dto/signup-input';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(signUpInput: SignUpInput) {
    const hashedPasswordArgon = await argon.hash(signUpInput.password);
    const user = await this.prisma.user.create({
      data: {
        name: signUpInput.name,
        email: signUpInput.email,
        hashedPassword: hashedPasswordArgon,
      },
    });
    const { accessToken, refreshToken } = await this.createToken(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    const { hashedPassword, ...result } = user;
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: result,
    };
  }
async signin(signInInput: SignInInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: signInInput.email },
    });
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    const isPasswordValid = await argon.verify(
      user.hashedPassword,
      signInInput.password,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid password');
    }
    const { accessToken, refreshToken } = await this.createToken(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    const { hashedPassword, ...result } = user;
    return {
      accessToken,
      refreshToken,
      user: result,
    };
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: { not: null },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
    return { loggedOut: true };
  }


  async createToken(userId: number, email: string) {
    const accessToken = this.jwtService.sign(
      { userId: userId, email: email },
      { expiresIn: '1h', secret: this.configService.get('JWT_SECRET') },
    );
    const refreshToken = this.jwtService.sign(
      { userId: userId, email: email },
      { expiresIn: '7d', secret: this.configService.get('JWT_SECRET') },
    );
    return { accessToken: accessToken, refreshToken: refreshToken };
  }
  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hashedRefreshToken },
    });
  }
```

sign up=> truyền vào signupInput trong đó có password, name, email
hash password rồi gọi prismaService create data là name, email, hashedPassword
tạo accesssToken và refreshToken để trả về DTO

refresh token sẽ update trong dataBase bằng cách hash argon, refresh lại mỗi lần user đăng nhập
logout=> tar về loggout = true và chỉ xóa refreshToken nếu như refreshToken trong database đang khác null=> tránh việc gọi logout nhiều lần loãng database

updateMany là bởi vì sẽ có nhiều thằng nó cũng có refeshToken giống nhau (vì refreshToken trong database không có @unique)

# Strategies, Guards, Custom Decorators
