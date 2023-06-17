import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateSessionResponse {
  @Field()
  url: string;
}
