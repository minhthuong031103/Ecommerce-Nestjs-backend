export type JwtPayLoad = {
  email: string;
  userId: number;
};

//the properties we signed in the jwt token
export type JwtPayloadWithRefreshToken = JwtPayLoad & { refreshToken: string };
//the properties we signed in the jwt token and the refresh token
