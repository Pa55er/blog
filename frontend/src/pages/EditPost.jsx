import style from "../styles/CreatePost.module.css";
import ToastEditor from "../components/ToastEditor";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPost() {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [files, setFiles] = useState("");
    const [content, setContent] = useState("");
    const [cover, setCover] = useState("");
    const { postId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getPost = async () => {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/editPage/${postId}`
            );
            const data = await response.json();
            setTitle(data.title);
            setSummary(data.summary);
            setContent(data.content);
            setCover(data.cover);
        };
        getPost();
    }, [postId]);

    const updataPost = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.set("title", title);
        data.set("summary", summary);
        data.set("content", content);

        if (files?.[0]) {
            data.set("files", files?.[0]);
        }

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/editPost/${postId}`,
            {
                method: "PUT",
                body: data,
                credentials: "include",
            }
        );

        const result = await response.json();
        if (result.message === "ok") {
            navigate(`/detail/${postId}`);
        }
    };

    return (
        <section className={style.CreatePost}>
            <h2>글 작성페이지</h2>
            <form className={style.writecom} onSubmit={updataPost}>
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
                <p className={style.smallimg}>
                    <img
                        src={`${import.meta.env.VITE_API_URL}/${cover}`}
                        alt=""
                    />
                </p>
                <label>내용</label>
                <ToastEditor initialValue={content} onChange={setContent} />
                <button type="submit">등록</button>
            </form>
        </section>
    );
}
