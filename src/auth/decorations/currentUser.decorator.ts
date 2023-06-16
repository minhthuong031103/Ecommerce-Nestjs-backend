import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayloadWithRefreshToken } from '../types';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (
    //key of: union of the key in the JwtPayloadWithRefreshToken
    //(one in three: email, userId, refreshToken), so we can pass like @CurrentUser('email')...
    //or we will not pass in parameter and we will get the whole user object

    // context will return this: ExecutionContextHost {
    //   args: [
    //     undefined,
    //     {},
    //     { req: [IncomingMessage] },
    //     {
    //       fieldName: 'hello',
    //       fieldNodes: [Array],
    //       returnType: [GraphQLNonNull],
    //       parentType: [GraphQLObjectType],
    //       path: [Object],
    //       schema: [GraphQLSchema],
    //       fragments: [Object: null prototype] {},
    //       rootValue: undefined,
    //       operation: [Object],
    //       variableValues: {},
    //       cacheControl: [Object]
    //     }
    //   ],
    //   constructorRef: [class AuthResolver],
    //   handler: [Function: hello],
    //   contextType: 'graphql'
    // }

    data: keyof JwtPayloadWithRefreshToken | undefined,
    context: ExecutionContext,
  ) => {
    const ctx = GqlExecutionContext.create(context);
    //the ctx.getContext().req will return like the req object in express,
    //inside the req object we have the user object
    //it only has user if the request has valid token and pass Guard
    const req = ctx.getContext().req;

    if (data) return req.user[data];
    return req.user;
  },
);
