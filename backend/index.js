const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

const mongoose = require("mongoose");
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("DB 연결 완료");
    })
    .catch((error) => console.dir(error));
const User = require("./models/User");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// -------------------------------------------------------------------

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, saltRounds),
        });
        res.json(userDoc);
    } catch (error) {
        res.status(409).json({
            message: "이미 존재하는 이름입니다",
            filled: "username",
            // error: e,
        });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
        res.status(404).json({ message: "존재하지 않는 사용자입니다" });
        return;
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        // 로그인 성공시 토큰 발급 쿠키에 저장
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json({
                id: userDoc._id,
                username,
            });
        });
    } else {
        res.status(400).json({ message: "비밀번호가 틀렸습니다" });
    }
});

// header 에서 token을 받아와서 검증하는 과정
app.get("/profile", async (req, res) => {
    const { token } = req.cookies;
    console.log("token ----", token);
    if (!token) {
        res.status(401).json("로그인이 필요합니다");
        return;
    }
    try {
        jwt.verify(token, secret, {}, (err, info) => {
            if (err) throw err;
            res.json(info);
        });
    } catch (error) {
        res.json("로그인이 필요합니다");
        return;
    }
});

// 로그아웃
app.post("/logout", (req, res) => {
    res.cookie("token", "").json("로그아웃 되었습니다");
});

app.listen(port, () => {
    console.log(`${port}번에서 서버 돌아가는 중...`);
});
