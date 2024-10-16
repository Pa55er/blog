import style from "../styles/PostDetailPage.module.css";

export default function PostDetailPage() {
	return (
		<section className={style.PostDetailPage}>
			<h2>블로그 상세 페이지</h2>
			<section>
				<div className={style.detailimg}>
					<h3>블로그 글 제목</h3>
				</div>
				<div className={style.info}>
					<p>작성자: username</p>
					<p>작성일: 2021-08-11</p>
				</div>
				<div className={style.summary}>블로그 요약 내용</div>
				<div className={style.desc}>
					Lorem ipsum dolor sit, amet consectetur adipisicing elit.
					Magni, fugiat delectus porro laborum id velit placeat natus
					illum numquam consequuntur, ad deserunt totam. Nihil,
					inventore alias. Beatae nihil cupiditate minima?
				</div>
			</section>

			<section className={style.btns}>
				{/* 로그인한 사용자만 글을 수정, 삭제할 수 있습니다. */}
				<button>수정</button>
				<button>삭제</button>
				<button>목록으로</button>
			</section>

			<section className={style.commentlist}>댓글목록</section>
		</section>
	);
}
