import { AuthGuard } from "@nestjs/passport";

export default class JwtGuard extends AuthGuard('jwtcok') {
    constructor() {
        super();
    }
};
