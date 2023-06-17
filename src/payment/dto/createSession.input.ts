import { Field, InputType } from '@nestjs/graphql';

@InputType() //input=> inputtype, response=> objecttype
export class CreateSessionInput {
  @Field()
  id: number;

  @Field()
  quantity: number;
}
