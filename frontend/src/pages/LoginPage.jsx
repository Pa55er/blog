import { useCallback, useState } from "react";
import style from "../styles/LoginPage.module.css";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            // 서버와 통신 코드 작성
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/login`,
                {
                    method: "POST",
                    body: JSON.stringify({ username, password }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );

            if (response.ok) {
                setRedirect(true);
            } else {
                setError("로그인에 실패했습니다");
            }
        },
        [username, password]
    );

    if (redirect) return <Navigate to="/" />;

    return (
        <form className={style.LoginPage} onSubmit={handleSubmit}>
            <h2>로그인 페이지</h2>
            <input
                type="text"
                placeholder="아이디"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="패스워드"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div className={style.error}>{error}</div>}
            <button type="submit">로그인</button>
        </form>
    );
}
