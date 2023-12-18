const express = require('express')
const router = express.Router()

const {noParam,
 getLivres,
getLivreById,
getPages,
getPage,
postLivre,
deleteLivre,
putLivre,
createToken,
verificationToken} = require('./controller')

router.get("/", noParam);
router.get("/livres", verificationToken, getLivres)
router.get("/livres/:id", verificationToken, getLivreById)
router.get("/livres/:id/pages", verificationToken, getPages)
router.get("/livres/:id/pages/:page", verificationToken, getPage)
router.post("/livres", verificationToken, postLivre)
router.delete("/livres/:id", verificationToken, deleteLivre)
router.put("/livres", verificationToken, putLivre)
router.get("/jeton", createToken)
router.get("/verify", verificationToken)

module.exports = router