
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class EmailConfirmationGuard implements CanActivate { canActivate(context: ExecutionContext,) {
    
    const request = context.switchToHttp().getRequest();
    if (!request.user?.is_email_confirmed) {
      throw new UnauthorizedException('Confirm your email first');
    }

    return true;
  
  }
}