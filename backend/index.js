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
const Post = require("./models/Post");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// 글쓰기 기능
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage: storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 파일 처리 함수
function handleFile(req) {
    if (req.file) {
        const { filename, path: filePath } = req.file;
        const newPath = filePath + path.extname(req.file.originalname);
        fs.renameSync(filePath, newPath);
        return newPath;
    }
    return null;
}

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
        return res.json("로그인이 필요합니다");
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

// 글쓰기 기능
app.post("/postWrite", upload.single("files"), async (req, res) => {
    const newPath = handleFile(req);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.username,
        });
        res.json(postDoc);
    });
});

// 글 목록 가져오기
app.get("/postList", async (req, res) => {
    const postList = await Post.find().sort({ createdAt: -1 });
    res.json(postList);
});

// 글 상세보기
app.get("/postDetail/:id", async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id);
    res.json(postDoc);
});

// 글 삭제하기
app.delete("/deletePost/:id", async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.json({ message: "ok" });
});

// 글 상세정보
app.get("/editPage/:id", async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id);
    res.json(postDoc);
});

// 글 수정하기
app.put("/editPost/:id", upload.single("files"), async (req, res) => {
    const newPath = handleFile(req);
    const { id } = req.params;
    const { token } = req.cookies;
    if (!token) return res.json("로그인이 필요합니다");

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        const postDoc = await Post.findByIdAndUpdate(id, {
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        });
        res.json({ message: "ok" });
    });
});

// 회원 정보 페이지
app.get("/userpage/:username", async (req, res) => {
    const { username } = req.params;
    try {
        const userDoc = await User.findOne({ username });
        if (!userDoc) {
            return res
                .status(404)
                .json({ message: "사용자정보를 찾을 수 없어요" });
        }
        res.json(userDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버에러" });
    }
});

// 회원 정보 수정
app.put(
    "/updataUserInfo/:username",
    upload.single("userImage"),
    async (req, res) => {
        const { username } = req.params;
        const { password, newpassword } = req.body;

        try {
            const userDoc = await User.findOne({ username });
            if (!userDoc) {
                return res
                    .status(404)
                    .json({ message: "사용자정보를 찾을 수 없어요" });
            }

            // 현재 비밀번호 확인
            const passOk = bcrypt.compareSync(password, userDoc.password);
            if (!passOk) {
                return res
                    .status(400)
                    .json({ message: "현재 비밀번호가 맞지 않아요" });
            }

            // 업데이트할 정보 객체
            const updateData = {};

            // 새 비밀번호가 제공된 경우 업데이트
            if (newpassword) {
                updateData.password = bcrypt.hashSync(newpassword, saltRounds);
            }

            // 새 이미지가 업로드된 경우 업데이트
            if (req.file) {
                updateData.userImage = req.file.filename;
            }

            // 사용자 정보 업데이트
            await User.findByIdAndUpdate(userDoc._id, updateData);

            res.json({ message: "사용자 정보가 정상적으로 수정되었습니다" });
        } catch (error) {
            console.error("Error updating user info:", error);
            res.status(500).json({ message: "서버에러" });
        }
    }
);

app.listen(port, () => {
    console.log(`${port}번에서 서버 돌아가는 중...`);
});
