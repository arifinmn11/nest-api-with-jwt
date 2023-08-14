import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { use } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export default class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwtcok'
) {
    constructor(
        private config: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET')
        })
    }

    async validate(payload: {
        sub: number,
        email: string
    }
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: payload.sub
            }
        })
        delete user.hash

        return user;
    }
};
