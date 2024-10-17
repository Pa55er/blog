import { useState } from "react";
import style from "../styles/CreatePost.module.css";
import ToastEditor from "../components/ToastEditor";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [files, setFiles] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const createNewPost = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.set("title", title);
        data.set("summary", summary);
        data.set("files", files[0]);
        data.set("content", content);

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/postWrite`,
            {
                method: "POST",
                body: data,
                credentials: "include",
            }
        );

        if (response.ok) {
            navigate("/");
        } else {
            alert("글 작성에 실패했습니다");
        }
    };

    return (
        <section className={style.CreatePost}>
            <h2>글 작성페이지</h2>
            <form className={style.writecom} onSubmit={createNewPost}>
                <label htmlFor="title">제목</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="summary">요약내용</label>
                <input
                    type="text"
                    id="summary"
                    name="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                />
                <label htmlFor="files">파일첨부</label>
                <input
                    type="file"
                    id="files"
                    name="files"
                    onChange={(e) => setFiles(e.target.files)}
                />
                <label>내용</label>
                <ToastEditor initialValue={content} onChange={setContent} />
                <button type="submit">등록</button>
            </form>
        </section>
    );
}
