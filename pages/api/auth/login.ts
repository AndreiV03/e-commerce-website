import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import bcrypt from "bcrypt";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, password } = req.body;

    const { default: UsersModel } = await import("../../../models/users-model");
    const user = await UsersModel.findOne({ email }).select("password").lean();
    if (!user) return res.status(400).json({ message: "User not found!" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password!" });

    const { default: Token } = await import("../../../utils/token");
    const accessToken = await Token.signToken(user._id, "10m");
    const refreshToken = await Token.signToken(user._id, "7d");

    res.setHeader("Set-Cookie", cookie.serialize("refreshToken", refreshToken, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development"
    }));

    return res.status(200).json({ accessToken });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST": return login(req, res);
    default: return res.status(404).json({ message: "API route not found!" });
  }
}

export default handler;