import { Link, useParams } from "react-router-dom";
import style from "../styles/PostDetailPage.module.css";
import { useEffect, useState } from "react";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { useSelector } from "react-redux";

export default function PostDetailPage() {
    const { postId } = useParams();
    const [postInfo, setPostInfo] = useState(null);
    const [formattedDate, setFormattedDate] = useState("");
    const user = useSelector((state) => state.user.user);
    const username = user?.username;

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/postDetail/${postId}`
                );
                const data = await response.json();
                setPostInfo(data);
                setFormattedDate(formatDate(data.createdAt));
            } catch (e) {
                console.error(e);
            }
        };
        fetchPostDetail();
    }, [postId]);

    const formatDate = (data) => {
        const d = new Date(data);
        return d.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "utc",
        });
    };

    const deletePost = async () => {
        fetch(`${import.meta.env.VITE_API_URL}/deletePost/${postId}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.message === "ok") {
                    alert("삭제되었습니다.");
                    window.location.href = "/";
                }
            });
    };

    if (!postInfo) {
        return <div>로딩 중...</div>;
    }

    return (
        <section className={style.PostDetailPage}>
            <h2>블로그 상세 페이지</h2>
            <section>
                <div className={style.detailimg}>
                    <img
                        src={`${import.meta.env.VITE_API_URL}/${
                            postInfo.cover
                        }`}
                        alt=""
                    />
                    <h3>{postInfo.title}</h3>
                </div>
                <div className={style.info}>
                    <p>작성자: {postInfo.author}</p>
                    <p>작성일: {formattedDate}</p>
                </div>
                <div className={style.summary}>{postInfo.summary}</div>
                <div className={style.desc}>
                    <Viewer initialValue={postInfo.content} />
                </div>
            </section>

            <section className={style.btns}>
                {/* 로그인한 사용자만 글을 수정, 삭제할 수 있습니다. */}
                {username === postInfo?.author && (
                    <>
                        <Link to={`/edit/${postId}`}>수정</Link>
                        <span onClick={deletePost}>삭제</span>
                    </>
                )}
                <Link to="/">목록으로</Link>
            </section>

            <section className={style.commentlist}>댓글목록</section>
        </section>
    );
}
