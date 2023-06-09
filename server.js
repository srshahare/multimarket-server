require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs")
const https = require("https")

// const key = fs.readFileSync('private.key')
// const cert = fs.readFileSync('certificate.crt')

const app = express();

// const cred = {
//     key,
//     cert
// }

const db = require("./models")

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


db.sequelize.sync({ force: false }).then(() => {
    console.log("DB Synced")
})

app.use((err, req, res, next) => {
    res.status(500).send({
        type: "Server Error",
        message: err.message
    })
})

app.get('/status', (req, res) => {
    res.status(200).send("OK")
})

// app.get('/.well-known/pki-validation/CEC579C2F2308E435267EC16AF98861F.txt', (req, res) => {
//     res.sendFile('/home/ec2-user/multimarket-server/CEC579C2F2308E435267EC16AF98861F.txt')
// })

// routes
app.use("/auth", require("./routes/auth.routes"))
app.use("/agent", require("./routes/agent.routes"))
app.use("/sales", require("./routes/sales.routes"))
app.use("/user", require("./routes/user.routes"))
app.use("/member", require("./routes/member.routes"))


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is listening on port :", PORT);
}); 