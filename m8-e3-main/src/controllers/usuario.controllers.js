export const perfilUsuario = async (req, res) => {
  return res.json({
    mensaje: "Acceso otorgado",
    usuario: req.usuario,
  });
};
