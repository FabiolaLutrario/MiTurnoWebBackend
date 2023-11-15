const { generateToken } = require("../config/tokens");
const { validateAuth } = require("../config/auth");
const { validateToken } = require("../config/tokens");
const { transporter } = require("../config/mailer");
const User = require("../models/User");

class UsersController {
  static register(req, res) {
    const { fullName, dni, email, password, role } = req.body;

    if (!fullName || !dni || !email || !password || !role) {
      return res
        .status(400)
        .send({ error: "Todos los campos son obligatorios" });
    }

    User.create(req.body)
      .then((user) => {
        res.status(201).send(user);
      })
      .catch((error) => {
        console.error("Error when trying to register user:", error);
        return res.status(500).send("Internal Server Error");
      });
  }

  static login(req, res) {
    const { email, password } = req.body;

    User.findOne({ where: { email } })
      .then((user) => {
        if (!user) return res.sendStatus(401);
        user.validatePassword(password).then((isValid) => {
          if (!isValid) return res.sendStatus(401);

          const payload = {
            id: user.id,
            fullName: user.fullName,
            dni: user.dni,
            email: user.email,
            role: user.role,
          };

          const token = generateToken(payload, "1d");

          res.cookie("token", token);

          res.send(payload);
        });
      })
      .catch((error) => {
        console.error("Error when trying to login user:", error);
        return res.status(500).send("Internal Server Error");
      });
  }

  static validateAuthUser(req, res) {
    validateAuth(req, res, () => {
      res.send(req.user);
    });
  }

  static getSingleUser(req, res) {
    const { id } = req.params;

    User.findOne({ where: { id } })
      .then((user) => {
        if (!user) return res.sendStatus(404);
        const payload = {
          id: user.id,
          fullName: user.fullName,
          dni: user.dni,
          email: user.email,
          role: user.role,
        };
        res.status(200).send(payload);
      })
      .catch((error) => {
        console.error("Error when trying to get user:", error);
        return res.status(500).send("Internal Server Error");
      });
  }

  static logout(req, res) {
    res.clearCookie("token");
    res.status(204).send("Logged out");
  }

  static editProlife(req, res) {
    const id = req.params.userId;

    User.update(req.body, { where: { id }, returning: true })
      .then(([rows, users]) => {
        res.status(200).send(users[0]);
      })
      .catch((error) => {
        console.error("Error when trying to update user:", error);
        return res.status(500).send("Internal Server Error");
      });
  }

  static sendEmail(req, res) {
    const email = req.body.email;

    User.findOne({ where: { email } })
      .then((user) => {
        if (!user) return res.sendStatus(401);

        //Si el usuario existe va a generar un token
        const payload = {
          id: user.id,
          fullName: user.fullName,
          dni: user.dni,
          email: user.email,
          role: user.role,
        };

        const token = generateToken(payload, "10m");
        user.token = token;

        user
          .save()
          .then(() => {
            //Genera el link de recuperación de contraseña y lo envía por correo
            const restorePasswordURL = `http://localhost:5000/overwrite-password/${user.token}`;
            const info = transporter.sendMail({
              from: '"Recuperación de contraseña" <fabiolalutrario@gmail.com>',
              to: user.email,
              subject: "Recuperación de contraseña ✔",
              html: `<b>Por favor haz click en el siguiente link, o copia el enlace y pegalo en tu navegador para completar el proceso:</b><a href="${restorePasswordURL}">${restorePasswordURL}</a>`,
            });
            info.then(() => {
              res.status(200).send(user.email);
            });
          })
          .catch(() => {
            res.send("Something went wrong");
          });
      })
      .catch((error) => {
        console.error("Error when trying to restore password:", error);
        return res.status(500).send("Internal Server Error");
      });
  }

  /*  Una vez que el usuario recibe el correo con el link para cambiar la contraseña
  se procede a validar el token para mostrar en el front el formulario para 
  ingresar la nueva contraseña*/
  static validateTokenToRestorePassword(req, res) {
    const token = req.params.token;
    if (!token) return res.sendStatus(401);

    const { user } = validateToken(token);
    if (!user) return res.sendStatus(401);

    User.findOne({ where: { token } })
      .then((user) => {
        if (!user) return res.sendStatus(401);
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error("Error when trying to validate token:", error);
        return res.status(500).send("Internal Server Error");
      });
  }

  /* En el momento en que el usuario le de click para confirmar la nueva contraseña y haya
  pasado las validaciones del front vuelve a verificar si el token sigue siendo válido o 
  si no ha expirado y luego se guarda la nueva contraseña*/
  static overwritePassword(req, res) {
    const token = req.params.token;
    if (!token) return res.sendStatus(401);

    const { user } = validateToken(token);
    if (!user) return res.sendStatus(401);

    User.findOne({ where: { token } })
      .then((user) => {
        if (!user) return res.sendStatus(401);

        user.token = null;
        user.password = req.body.password;
        user.save().then(() => {
          res.sendStatus(200);
        });
      })
      .catch((error) => {
        console.error("Error when trying to overwrite password:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
}
module.exports = UsersController;
