// mongodb에 저장할 데이터 형식을 정의하는 부분
// https://mongoosejs.com/ 참고

const mongoose = require("mongoose");
const { Schema, model } = mongoose; // mongoose에서 Schema, model 가져오기

// Schema는 데이터의 형식을 정의하는 부분
const UserSchema = new Schema(
    {
        username: { type: String, required: true, unique: true }, // username은 String이고, 필수로 입력해야 하며, 최소 4글자 이상이어야 함, 중복되면 안됨
        password: { type: String, required: true },
        userImage: { type: String, default: "" }, // userImage는 String이고, 기본값은 ""이다.
        createdAt: Date,
        update: Date,
    }
    // {
    //     timestamps: true,
    // },
    // { versionKey: false }
);

const UserModal = model("User", UserSchema); // UserModal이라는 이름으로 UserSchema를 model로 만들기
module.exports = UserModal;
//index.js에서 User.js를 import해서 사용할 수 있도록 module.exports로 내보내기
