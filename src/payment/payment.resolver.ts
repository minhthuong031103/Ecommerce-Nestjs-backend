import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { CreateSessionInput } from './dto/createSession.input';
import { CreateSessionResponse } from './dto/createSession.response';
import { Public } from 'src/auth/decorations/public.decorator';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Mutation(() => CreateSessionResponse)
  createCheckoutSession(
    @Args({ name: 'items', type: () => [CreateSessionInput] })
    createSessionInput: //type is a function return an array of CreateSessionInput, items is the name of the argument
    CreateSessionInput[],
  ) {
    // return this.paymentService.createCheckoutSession(createSessionInput);
  }
}
