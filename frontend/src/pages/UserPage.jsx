import { useEffect, useState } from "react";
import style from "../styles/UserPage.module.css";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

export default function UserPage() {
    const user = useSelector((state) => state.user.user);
    const loginUser = user?.username;

    const { userinfo } = useParams();
    const [pageUser, setPageUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userImage, setUserImage] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/userpage/${userinfo}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const data = await response.json();
                setPageUser(data);
                setUserImage(data.userImage);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [userinfo]); // userinfo가 변경될 때마다 실행

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!pageUser) return <div>User not found</div>;

    return (
        <section className={style.UserPage}>
            <h2>UserPage</h2>
            <div className={style.userimg}>
                {userImage ? (
                    <img
                        src={`${
                            import.meta.env.VITE_API_URL
                        }/uploads/${userImage}`}
                        alt={pageUser.username}
                    />
                ) : (
                    <img src="/user-profile.jpg" alt={pageUser.username} />
                )}
            </div>
            <p>{pageUser.username}님의 정보입니다</p>
            <hr />
            {pageUser.username === loginUser ? (
                <div>
                    <Link to={`/updataUserInfo/${loginUser}`}>
                        회원정보수정
                    </Link>
                    <span>회원탈퇴</span>
                </div>
            ) : (
                <p>메시지를 남겨주세요~</p>
            )}
        </section>
    );
}
