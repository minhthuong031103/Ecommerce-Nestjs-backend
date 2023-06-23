import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/accessToken.guard';
import { ProductModule } from './product/product.module';
import { PaymentModule } from './payment/payment.module';
import { CartModule } from './cart/cart.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // GraphQLModule.forRootAsync<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //       cors: {
    //         origin: config.get('CLIENT_URL'),
    //       },
    //       sortSchema: true,
    //       playground: true,
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    AuthModule,
    UserModule,
    ProductModule,
    PaymentModule,
    CartModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AccessTokenGuard,
    // },
  ],
})
export class AppModule {}
