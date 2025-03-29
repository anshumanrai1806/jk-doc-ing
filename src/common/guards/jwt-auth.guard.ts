import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      let message = 'Invalid or missing authentication token';
  
      // Check if the error is due to an expired JWT
      if (info instanceof TokenExpiredError || info?.message?.includes('jwt expired')) {
        message = 'Authentication token has expired. Please log in again.';
      }
  
      throw new UnauthorizedException(message);
    }
    return user;
  }
}
