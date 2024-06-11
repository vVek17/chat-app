import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { addAuth, removeAuth } from "../redux/auth/authSlice";
import handleScrollTop from "../utils/handleScrollTop";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { setProfileDetail } from "../redux/auth/conditionSlice";

const Header = () => {
	const user = useSelector((store) => store.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [showProfileBox, setShowProfileBox] = useState(false);
	const token = localStorage.getItem("token");
	const getAuthUser = (token) => {
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addAuth(json.data));
			})
			.catch((err) => console.log(err));
	};
	useEffect(() => {
		if (token) {
			navigate("/");
			getAuthUser(token);
		} else {
			navigate("/signin");
		}
		setShowProfileBox(false);
	}, [token]);
	// Scroll to top of page && Redirect Auth change --------------------------------
	const { pathname } = useLocation();
	useEffect(() => {
		if (user) {
			navigate("/");
		} else if (pathname !== "/signin" && pathname !== "/signup") {
			navigate("/signin");
		}
		handleScrollTop();
	}, [pathname, user]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		dispatch(removeAuth());
		navigate("/signin");
	};

	useEffect(() => {
		var prevScrollPos = window.pageYOffset;
		const handleScroll = () => {
			var currentScrollPos = window.pageYOffset;
			if (prevScrollPos < currentScrollPos && currentScrollPos > 80) {
				document.getElementById("header").classList.add("hiddenbox");
			} else {
				document.getElementById("header").classList.remove("hiddenbox");
			}
			prevScrollPos = currentScrollPos;
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	return (
		<div
			id="header"
			className="w-full h-16 fixed top-0 z-50 md:h-20 shadow-gray-950 shadow-inner flex justify-between items-center p-4 font-semibold bg-slate-800 text-white"
		>
			<div className="flex items-center justify-start gap-2">
				<Link to={"/"}>
					<img
						src={Logo}
						alt="ChatApp"
						className="h-12 w-12 rounded-tr-full rounded-tl-full rounded-br-full"
					/>
				</Link>
				<Link to={"/"}>
					<span>ChatApp</span>
				</Link>
			</div>

			{user ? (
				<div className="flex flex-nowrap items-center">
					<span className="whitespace-nowrap ml-2">
						Hi, {user.firstName}
					</span>
					<div
						onClick={() => setShowProfileBox(!showProfileBox)}
						className="flex flex-nowrap transition-all items-center ml-3  border border-slate-400 rounded-full bg-gradient-to-tr to-slate-800 text-black via-white  from-slate-800 hover:bg-gradient-to-br shadow-sm  cursor-pointer"
					>
						<img
							src={user.image}
							alt="gg"
							className="w-10 h-10 rounded-full"
						/>
						<span className="m-2">
							{showProfileBox ? (
								<MdKeyboardArrowDown fontSize={20} />
							) : (
								<MdKeyboardArrowUp fontSize={20} />
							)}
						</span>
					</div>
					{showProfileBox && (
						<div className="border w-40 h-24 py-2 flex flex-col justify-center rounded-md items-center gap-1 absolute top-16 right-4 z-40 bg-white text-black">
							<div
								onClick={() => {
									setShowProfileBox(false);
									dispatch(setProfileDetail());
								}}
								className="flex flex-nowrap items-center w-full h-fit cursor-pointer justify-center hover:bg-slate-400 p-1"
							>
								Profile
							</div>
							<div
								className="flex flex-nowrap items-center w-full h-fit cursor-pointer justify-center hover:bg-slate-400 p-1"
								onClick={handleLogout}
							>
								Logout
							</div>
						</div>
					)}
				</div>
			) : (
				<Link to={"/signin"}>
					<button className="py-2 px-4 border border-slate-400 rounded-full bg-gradient-to-tr to-slate-800 text-black via-white  from-slate-800 hover:bg-gradient-to-br shadow-sm hover:shadow-white">
						SingIn
					</button>
				</Link>
			)}
		</div>
	);
};

export default Header;
