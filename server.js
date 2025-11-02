const portfinder = require('portfinder');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 8080;

// База данных SQLite (Остальное без изменений)

// Middleware (Остальное без изменений)

// Стратегия GitHub
const GitHubStrategy = require('passport-github2').Strategy;
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  // ИСПРАВЛЕНО: ПОРТ 5000 -> 5001, добавлен /api/
  callbackURL: 'http://localhost:5001/api/auth/github/callback' 
}, (accessToken, refreshToken, profile, done) => {
// ... (Логика DB без изменений)
}));

// Роуты

// ИСПРАВЛЕНО: Добавлен префикс /api/
app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// ИСПРАВЛЕНО: Добавлен префикс /api/
app.get('/api/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:3000/?token=${token}`);
  }
);

// Профиль (Остальное без изменений)

portfinder.getPort({ port: PORT }, (err, availablePort) => {
  if (err) throw err;
  app.listen(availablePort, () => console.log(`Сервер на http://localhost:${availablePort}`));
});