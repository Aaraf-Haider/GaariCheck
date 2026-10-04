import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  UserCircle,
  X,
} from "lucide-react";


function Navbar() {
  const navigate =
    useNavigate();

  const location =
    useLocation();


  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);


  const [
    user,
    setUser,
  ] = useState(() => {
    try {
      const storedUser =
        localStorage.getItem(
          "user"
        );

      return storedUser
        ? JSON.parse(
            storedUser
          )
        : null;

    } catch {
      return null;
    }
  });


  /* =====================================
     KEEP USER STATE IN SYNC
  ===================================== */

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem(
          "user"
        );

      setUser(
        storedUser
          ? JSON.parse(
              storedUser
            )
          : null
      );

    } catch {
      setUser(null);
    }


    setMobileOpen(false);

  }, [location.pathname]);


  /* =====================================
     LOGOUT
  ===================================== */

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );


    setUser(null);

    setMobileOpen(false);

    navigate("/");
  };


  /* =====================================
     DESKTOP LINK CLASS
  ===================================== */

  const navLinkClass = ({
    isActive,
  }) =>
    `relative py-2 transition-colors duration-200 ${
      isActive
        ? "text-orange-400"
        : "text-slate-300 hover:text-white"
    }`;


  /* =====================================
     PUBLIC LINKS
  ===================================== */

  const publicLinks = [
    {
      label: "Home",
      path: "/",
    },

    {
      label: "About",
      path: "/about",
    },

    {
      label: "What We Do",
      path: "/services",
    },

    {
      label: "Pricing",
      path: "/pricing",
    },

    {
      label: "Sample Report",
      path: "/sample-report",
    },

    {
      label: "Reviews",
      path: "/reviews",
    },

    {
      label: "Contact",
      path: "/contact",
    },
  ];


  return (
    <>
      {/* =====================================
          TOP BAR
      ===================================== */}

      <div className="bg-black text-slate-300 text-xs">

        <div className="gc-container min-h-[34px] flex items-center justify-between gap-4 py-2">

          <div className="flex items-center gap-2 min-w-0">

            <ShieldCheck
              size={14}
              className="text-green-400 shrink-0"
            />

            <span className="truncate sm:whitespace-normal">
              Remote Vehicle Inspection
              <span className="hidden sm:inline">
                {" "}• Human Reviewed
              </span>
            </span>

          </div>


          <div className="hidden md:block text-slate-400 whitespace-nowrap">
            Buy with more confidence.
          </div>

        </div>

      </div>


      {/* =====================================
          MAIN NAVBAR
      ===================================== */}

      <header className="sticky top-0 z-50 bg-[#0b1220]/95 backdrop-blur-xl border-b border-white/10 shadow-sm">

        <div className="gc-container">

          <div className="h-[72px] flex items-center justify-between gap-4">


            {/* =====================================
                BRAND
            ===================================== */}

            <Link
                to="/"
                onClick={() =>
                    setMobileOpen(false)
                }
                className="flex items-center shrink-0"
                aria-label="GaariCheck Home"
                >

                <div className="h-[48px] sm:h-[52px] w-[155px] sm:w-[185px] bg-white rounded-xl overflow-hidden flex items-center justify-center shadow-sm">

                    <img
                    src="/gaaricheck-logo.png"
                    alt="GaariCheck Vehicle Inspection"
                    className="w-full h-full object-contain scale-[1.18]"
                    />

                </div>

            </Link>

            {/* =====================================
                DESKTOP PUBLIC NAVIGATION
            ===================================== */}

            <nav className="hidden xl:flex items-center gap-6 2xl:gap-7 text-sm font-medium">

              {publicLinks.map(
                (item) => (

                  <NavLink
                    key={
                      item.path
                    }
                    to={
                      item.path
                    }
                    className={
                      navLinkClass
                    }
                  >

                    {({
                      isActive,
                    }) => (
                      <>
                        {
                          item.label
                        }

                        {isActive && (
                          <span className="absolute left-0 right-0 -bottom-[21px] h-[2px] rounded-full bg-orange-500" />
                        )}
                      </>
                    )}

                  </NavLink>
                )
              )}

            </nav>


            {/* =====================================
                DESKTOP RIGHT SIDE
            ===================================== */}

            <div className="hidden xl:flex items-center gap-2">

              {!user ? (
                <>

                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white transition"
                  >
                    Login
                  </Link>


                  <Link
                    to="/register"
                    className="px-4 py-2.5 text-sm font-semibold text-white border border-white/15 rounded-xl hover:bg-white/10 transition"
                  >
                    Register
                  </Link>


                  <Link
                    to="/pricing"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition"
                  >
                    Get Inspection
                  </Link>

                </>
              ) : (
                <>

                  {/* CUSTOMER */}

                  {user.role !==
                    "admin" && (
                    <>

                      <Link
                        to="/my-payments"
                        className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition"
                      >

                        <CreditCard
                          size={17}
                        />

                        Payments

                      </Link>


                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10 rounded-xl transition"
                      >

                        <LayoutDashboard
                          size={17}
                        />

                        Dashboard

                      </Link>

                    </>
                  )}


                  {/* ADMIN */}

                  {user.role ===
                    "admin" && (

                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 rounded-xl transition"
                    >

                      <LayoutDashboard
                        size={17}
                      />

                      Admin

                    </Link>
                  )}


                  {/* USER */}

                  <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-white/10">

                    {user.profilePicture ? (

                      <img
                        src={
                          user.profilePicture
                        }
                        alt={
                          user.name ||
                          "User"
                        }
                        className="w-8 h-8 rounded-full object-cover border border-white/10"
                      />

                    ) : (

                      <UserCircle
                        size={29}
                        className="text-slate-300"
                      />
                    )}


                    <span className="text-sm text-slate-200 max-w-[105px] truncate">

                      {user.name ||
                        "Account"}

                    </span>

                  </div>


                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition"
                  >

                    <LogOut
                      size={16}
                    />

                    Logout

                  </button>

                </>
              )}

            </div>


            {/* =====================================
                MOBILE BUTTON
            ===================================== */}

            <button
              type="button"
              onClick={() =>
                setMobileOpen(
                  !mobileOpen
                )
              }
              className="xl:hidden w-11 h-11 rounded-xl border border-white/10 bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition shrink-0"
              aria-label={
                mobileOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
              aria-expanded={
                mobileOpen
              }
            >

              {mobileOpen ? (

                <X
                  size={24}
                />

              ) : (

                <Menu
                  size={24}
                />
              )}

            </button>

          </div>

        </div>


        {/* =====================================
            MOBILE MENU
        ===================================== */}

        {mobileOpen && (

          <div className="xl:hidden bg-[#0b1220] border-t border-white/10 shadow-2xl">

            <div className="gc-container py-5">


              {/* PUBLIC LINKS */}

              <nav className="flex flex-col gap-1">

                {publicLinks.map(
                  (item) => (

                    <NavLink
                      key={
                        item.path
                      }
                      to={
                        item.path
                      }
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className={({
                        isActive,
                      }) =>
                        `px-4 py-3 rounded-xl text-sm font-semibold transition ${
                          isActive
                            ? "bg-orange-500/10 text-orange-400"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >

                      {
                        item.label
                      }

                    </NavLink>
                  )
                )}

              </nav>


              {/* =====================================
                  ACCOUNT AREA
              ===================================== */}

              <div className="border-t border-white/10 mt-5 pt-5">

                {!user ? (

                  <div className="grid grid-cols-2 gap-3">

                    <Link
                      to="/login"
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className="text-center border border-white/20 text-white rounded-xl py-3 font-semibold hover:bg-white/5 transition"
                    >
                      Login
                    </Link>


                    <Link
                      to="/register"
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className="text-center bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 font-semibold transition"
                    >
                      Register
                    </Link>


                    <Link
                      to="/pricing"
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className="col-span-2 text-center bg-white text-[#0b1220] rounded-xl py-3 font-bold hover:bg-slate-100 transition"
                    >
                      Get Inspection
                    </Link>

                  </div>

                ) : (

                  <div className="space-y-2">


                    {/* USER CARD */}

                    <div className="flex items-center gap-3 px-4 py-4 bg-white/5 border border-white/5 rounded-xl">

                      {user.profilePicture ? (

                        <img
                          src={
                            user.profilePicture
                          }
                          alt={
                            user.name ||
                            "User"
                          }
                          className="w-10 h-10 rounded-full object-cover"
                        />

                      ) : (

                        <UserCircle
                          size={32}
                          className="text-slate-300 shrink-0"
                        />
                      )}


                      <div className="min-w-0">

                        <div className="text-white font-semibold truncate">

                          {user.name ||
                            "Account"}

                        </div>


                        <div className="text-xs text-slate-400 mt-0.5 truncate">

                          {user.email}

                        </div>

                      </div>

                    </div>


                    {/* ADMIN DASHBOARD */}

                    {user.role ===
                    "admin" ? (

                      <Link
                        to="/admin"
                        onClick={() =>
                          setMobileOpen(
                            false
                          )
                        }
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white bg-white/5 hover:bg-white/10 transition"
                      >

                        <LayoutDashboard
                          size={18}
                        />

                        Admin Dashboard

                      </Link>

                    ) : (
                      <>

                        {/* CUSTOMER DASHBOARD */}

                        <Link
                          to="/dashboard"
                          onClick={() =>
                            setMobileOpen(
                              false
                            )
                          }
                          className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white bg-white/5 hover:bg-white/10 transition"
                        >

                          <LayoutDashboard
                            size={18}
                          />

                          My Dashboard

                        </Link>


                        {/* MY PAYMENTS */}

                        <Link
                          to="/my-payments"
                          onClick={() =>
                            setMobileOpen(
                              false
                            )
                          }
                          className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white bg-white/5 hover:bg-white/10 transition"
                        >

                          <CreditCard
                            size={18}
                          />

                          My Payments

                        </Link>

                      </>
                    )}


                    {/* LOGOUT */}

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-red-300 hover:bg-red-500/10 rounded-xl transition"
                    >

                      <LogOut
                        size={18}
                      />

                      Logout

                    </button>

                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </header>
    </>
  );
}


export default Navbar;