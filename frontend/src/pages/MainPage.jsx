import style from "../styles/MainPage.module.css";
import PostCard from "../components/PostCard";

export default function MainPage() {
	return (
		<section className={style.MainPage}>
			<PostCard />
			<PostCard />
			<PostCard />
			<PostCard />
			<PostCard />
		</section>
	);
}
