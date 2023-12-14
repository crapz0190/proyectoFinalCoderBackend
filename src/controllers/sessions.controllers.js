import { userRepository } from "../services/repository/users.repository.js";
import { hashData } from "../utils.js";
import { generateToken } from "../libs/jwt.js";
import UserReqDTO from "../dto/user.login.req.dto.js";
import UserResCurrent from "../dto/user.current.res.dto.js";

class SessionController {
  // Metodo GET permite desde un boton cerrar sesion
  destroySession = (req, res) => {
    try {
      return req.session.destroy(() => {
        res.redirect("/login");
      });
    } catch (e) {
      return res.status(500).json({ status: "error", message: e.message });
    }
  };

  // Metodo POST permite registrarse en la DB
  access = async (req, res) => {
    try {
      const user = await userRepository.findByEmail(req.user.email);
      const userDTO = new UserResCurrent(user);
      console.log("USER DTO ---> ", userDTO);
      return res.redirect("/products");
    } catch (e) {
      return res.status(500).json({ status: "error", message: e.message });
    }
  };

  // Metodo POST permite el ingreso del usuario a su cuenta
  loginUser = (req, res) => {
    try {
      //jwt
      // const { first_name, last_name, email, role } = req.user;
      const userDTO = new UserReqDTO(req.user);
      const { name, surname, email, role } = userDTO;
      const token = generateToken({ name, surname, email, role });
      // const token = generateToken({ first_name, last_name, email, role });
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/api/sessions/current");
      const user = userDTO;
      return user;
    } catch (e) {
      return res.status(500).json({ status: "error", message: e.message });
    }
  };

  // Metodo POST permite restaurar contraseña
  restorePassword = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "Email does not exist" });
      }

      const hashPassword = await hashData(password);
      user.password = hashPassword;
      await user.save();
      return res.status(200).json({ message: "Password updated" });
    } catch (e) {
      return res.status(500).json({ status: "error", message: e.message });
    }
  };
}

export const sessionController = new SessionController();
