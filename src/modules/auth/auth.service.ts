import bcrypt from "bcrypt";
import { prisma } from "../../db/prisma.js";
import { signAccess, signRefresh, verifyRefresh } from "../../utils/jwt.js";
import { logSuccess } from "../../utils/logger.js";

interface RefreshTokenPayload {
  sub: string;
  role: string;
}

export class AuthService {
  async register(name: string, email: string, password: string) {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      throw {
        status: 409,
        code: "EMAIL_IN_USE",
        message: "E-mail já cadastrado",
      };
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: "STUDENT" },
    });
    return this.issue(user.id, user.role);
  }
async login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    throw {
      status: 401,
      code: "BAD_CREDENTIALS",
      message: "Credenciais inválidas",
    };

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok)
    throw {
      status: 401,
      code: "BAD_CREDENTIALS",
      message: "Credenciais inválidas",
    };

  logSuccess("Usuário logado com sucesso");

  const tokens = this.issue(user.id, user.role);

  return {
    ...tokens,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

issue(sub: string, role: string) {
  return {
    accessToken: signAccess({ sub, role }),
    refreshToken: signRefresh({ sub, role }),
  };
}

  async refresh(token: string) {
    const payload = verifyRefresh(token) as RefreshTokenPayload;
    return this.issue(payload.sub, payload.role);
  }
}
