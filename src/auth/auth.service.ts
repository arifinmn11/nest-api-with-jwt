import { Delete, ForbiddenException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { badReqResponse, internalErrResponse, notFoundResponse, successResponse } from "src/utils/response-json";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    async login(req: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: req.email
            }
        });

        if (!user)
            return notFoundResponse("Data not found", user);

        const pwMatch = await argon.verify(user.hash, req.password);

        if (!pwMatch) {
            return badReqResponse("Credential error!");
        }

        //delete user.hash;
        const token = await this.signToken(user.user_id, user.email);

        // return token;
        return successResponse("Login success!", token);
    }

    async signup(req: AuthDto) {
        try {
            const hash = await argon.hash(req.password);
            const user = await this.prisma.user.create({
                data: {
                    email: req.email,
                    hash,
                }
            });

            delete user.hash;

            return successResponse("Success has been saved!", user);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                return badReqResponse("Bad Request !", error);
            }
            return internalErrResponse();
        }


    }

    async signToken(
        userId: number,
        email: string
    ): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        }
        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(payload, {
            secret: secret
        });

        return {
            access_token: token
        }
    }
}
