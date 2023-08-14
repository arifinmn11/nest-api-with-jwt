import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import JwtStrategy from "./strategy/jwt.strategy";

@Module({
    imports: [JwtModule.register({
        global: true,
        signOptions: {
            expiresIn: '1d'
        },
    })],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule { }