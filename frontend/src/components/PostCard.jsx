import { Link } from "react-router-dom";
import style from "../styles/PostCard.module.css";
import { useNavigate } from "react-router-dom";

export default function PostCard() {
    const navigate = useNavigate();
    const goDetail = () => {
        navigate("/detail");
    };

    return (
        <article className={style.PostCard} onClick={goDetail}>
            <div className={style.post_text}>
                <h2 className={style.__title}>
                    오늘의집이 시공 시장 혁신에 나선 이유
                </h2>
                <p className={style.__info}>
                    <Link to="/userInfo" className={style.author}>
                        somysem
                    </Link>
                    <time className={style.date}>2024.10.13 16:0</time>
                </p>
                <p className={style.__dec}>
                    올해 2월 오늘의집은 좋지 않은 구설수에 휘말리고 맙니다.
                    오늘의집 시공 중개 서비스를 이용했다가, 업체와의 분쟁이
                    일어나 피해를 입었다는 일부 고객의 사례가 기사화된 겁니다.
                </p>
            </div>
            <div className={style.post_img}>
                <img src="https://picsum.photos/1200/800" alt="" />
            </div>
        </article>
    );
}
