import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PostDetailPage from "./pages/PostDetailPage";

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<MainPage />} />
				<Route path="login" element={<LoginPage />} />
				<Route path="register" element={<RegisterPage />} />
				<Route path="detail" element={<PostDetailPage />} />
			</Route>
			<Route
				path="*"
				element={
					<div className="nopage">
						? <br />
						없는 페이지 입니다
					</div>
				}
			/>
		</Routes>
	);
}
