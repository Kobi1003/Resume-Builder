import React from 'react'
import logo from "../../assets/logo.svg";
import users from "../../assets/users.png";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Hero = () => {
    const { user } = useSelector((state) => state.auth);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const logos = [
        'https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/framer.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg',
    ];

    return (
        <>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
                    @import url('https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap');

                    * {
                        font-family: 'Geist', sans-serif;
                    }
                    h1{
                        font-family: "Urbanist", sans-serif;
                    }
                `}
            </style>

            <header className='flex flex-col items-center justify-center relative bg-gradient-to-b from-green-50 to-white overflow-hidden'>

                {/* 🌟 Glow Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-green-300 rounded-full blur-3xl opacity-30"></div>

                {/* NAVBAR */}
                <nav className="flex flex-col items-center w-full z-10">
                    <div className="flex items-center justify-between p-4 md:px-24 lg:px-32 xl:px-40 md:py-4 border-b border-zinc-200 w-full bg-white/70 backdrop-blur">
                        <a href="#">
                            <img className="h-8" src={logo} alt="logo" />
                        </a>

                        <div id="menu" className={`${mobileOpen ? 'max-md:w-full' : 'max-md:w-0'} max-md:fixed max-md:top-0 max-md:z-50 max-md:left-0 max-md:transition-all max-md:duration-300 max-md:overflow-hidden max-md:h-screen max-md:bg-white/25 max-md:backdrop-blur max-md:flex-col max-md:justify-center flex items-center gap-7 text-sm`}>
                            <a href="#" onClick={() => setMobileOpen(false)} className="text-zinc-800 hover:text-green-600">Home</a>
                            <a href="#Products" onClick={() => setMobileOpen(false)} className="text-zinc-800 hover:text-green-600">Products</a>
                            <a href="#Tools" onClick={() => setMobileOpen(false)} className="text-zinc-800 hover:text-green-600">Tools</a>
                            <a href="#Blogs" onClick={() => setMobileOpen(false)} className="text-zinc-800 hover:text-green-600">Blogs</a>
                            <a href="#Pricing" onClick={() => setMobileOpen(false)} className="text-zinc-800 hover:text-green-600">Pricing</a>
                            <Link to="/login" onClick={() => setMobileOpen(false)} className="text-zinc-800 hover:text-green-600 md:hidden">Login</Link>
                            <Link to="/app?state=register" onClick={() => setMobileOpen(false)} className="text-zinc-800 hover:text-green-600 md:hidden">Get Started</Link>

                            <button onClick={() => setMobileOpen(false)} className="md:hidden bg-zinc-900 hover:bg-zinc-800 text-white p-2 rounded-md aspect-square transition">
                                ✕
                            </button>
                        </div>

                        <div className="hidden md:flex items-center gap-4">
                            <Link to='/login?state=register' className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-sm text-sm transition cursor-pointer">
                                Get Started
                            </Link>
                            <Link to='/login' className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 rounded-sm text-sm transition cursor-pointer">
                                Login
                            </Link>
                        </div>

                        <button onClick={() => setMobileOpen(true)} className="md:hidden bg-zinc-900 hover:bg-zinc-800 text-white p-2 rounded-md aspect-square transition">
                            ☰
                        </button>
                    </div>
                </nav>

                {/* GRID LINES */}
                <div className="absolute top-[72px] left-0 right-0 bottom-0 pointer-events-none flex justify-between px-4 md:px-24 lg:px-32 xl:px-40">
                    <div className="w-px bg-zinc-200"></div>
                    <div className="w-px bg-zinc-200"></div>
                </div>

                {/* USERS BADGE */}
                <div className="flex items-center gap-2 px-4 py-1.5 mt-24 rounded-full border border-zinc-200 bg-white/60 backdrop-blur z-10">
                    <div className="relative flex size-4 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full opacity-75 animate-ping">
                            <img src={users} alt="users" className="h-full w-full object-cover" />
                        </span>
                        <span className="relative inline-flex size-2 rounded-full"></span>
                    </div>
                    <p className="text-sm text-zinc-600">Used by 10,000+ users</p>
                </div>

                {/* HEADING */}
                <h1 className="text-4xl md:text-5xl leading-tight text-center font-bold text-zinc-900 max-w-[640px] mt-5 px-4 z-10">
                    Land your dream jobs with our{" "}
                    <span className="bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent font-bold">
                        AI-Powered
                    </span>{" "}
                    Resumes
                </h1>

                {/* SUBTEXT */}
                <p className="text-sm md:text-base text-center max-w-[460px] mt-3 px-4 text-zinc-500 z-10">
                    Create, edit and download professional resumes with AI-powered assistance.
                </p>

                {/* BUTTONS */}
                <div className='flex gap-4 mt-8 z-10'>
                    <Link
                        to="/login?state=register"
                        className="group px-8 text-sm py-3 text-white bg-green-600 rounded-sm hover:scale-105 hover:bg-green-700 transition duration-300 active:scale-100 cursor-pointer shadow-lg shadow-green-200"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/login"
                        className="border border-zinc-300 px-8 text-sm py-3 text-zinc-700 bg-white rounded-sm hover:scale-105 hover:bg-zinc-50 transition duration-300 active:scale-100 cursor-pointer"
                    >
                        Login
                    </Link>
                </div>

                {/* IMAGE */}
                <div className="w-full px-4 md:px-24 lg:px-32 xl:px-40 mt-16 z-10">
                    <div className="px-4">
                        <img
                            className="max-h-64 md:max-h-96 object-cover object-top w-full max-w-[1100px] mx-auto border border-zinc-200 rounded-xl shadow-lg"
                            src="https://assets.prebuiltui.com/images/components/hero-section/hero-modern-dashboard.png"
                            alt="dashboard"
                        />
                    </div>
                </div>

            </header>
        </>
    )
}

export default Hero;