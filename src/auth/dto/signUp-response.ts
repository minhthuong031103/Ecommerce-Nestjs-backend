import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/user.entity';

@ObjectType()
export class SignInResponse {
  // @Field()
  // accessToken: string;

  // @Field()
  // refreshToken: string;

  // @Field(() => User)
  // user: User;
  @Field()
  message: string;
}
