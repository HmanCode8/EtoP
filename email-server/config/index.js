const config = {
  port: 3000,
  db: {
    host: "127.0.0.1",
    port: 27017,
    name: "email",
  },
  email: {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "your-email-address",
      pass: "your-email-password",
    },
  },
};

module.exports = config;
