import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { pool } from "./db.js";

dotenv.config();

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const GOOGLE_CLIENT_ID = requireEnv("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = requireEnv("GOOGLE_CLIENT_SECRET");
const GOOGLE_CALLBACK_URL = requireEnv("GOOGLE_CALLBACK_URL");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query("SELECT id, name, email, role FROM users WHERE id = ?", [id]);
    if (!rows.length) return done(null, false);
    return done(null, rows[0]);
  } catch (error) {
    return done(error, false);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const googleId = profile.id;
        if (!email) return done(new Error("Google account does not provide email"), false);

        const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existing.length) return done(null, existing[0]);

        const [result] = await pool.query(
          "INSERT INTO users (name, email, google_id, role) VALUES (?, ?, ?, 'user')",
          [name, email, googleId]
        );
        const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [result.insertId]);
        return done(null, rows[0]);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
