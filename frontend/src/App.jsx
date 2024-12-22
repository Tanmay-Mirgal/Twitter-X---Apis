import SignUpPage from "./pages/auth/signup/Signup.jsx";
import LoginPage from "./pages/auth/login/Login.jsx";
import HomePage from "./pages/home/Home.jsx";
import { Routes, Route } from "react-router-dom";


 export default function App() {
	return (
		<div className='flex max-w-6xl mx-auto'>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
			</Routes>
		</div>
	);
}