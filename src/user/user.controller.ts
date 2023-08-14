import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import JwtGuard from 'src/auth/guard/jwt.guard';
import { successResponse } from 'src/utils';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
    @Get('me')
    getMe(@GetUser() user: User) {
        return successResponse("Success!", user);
    }
}
