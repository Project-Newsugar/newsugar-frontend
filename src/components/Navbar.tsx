import { Link, useLocation, useNavigate } from "react-router-dom";
import { CATEGORIES } from "../constants/CategoryData";
import { getCategorySlug } from "../utils/getCategorySlug";
import { useAuth } from "../hooks/useAuth";
import noProfile from "../assets/noProfile.png";
import { useUserProfile } from "../hooks/useUserQuery";
import { ProfilePreviewPopup } from "./ProfilePreviewPopup";
import { useState } from "react";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { data: userProfile } = useUserProfile(isLoggedIn);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const currentCategory = location.pathname.split("/")[2];

  return (
    <header className="bg-white/90 backdrop-blur border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 tracking-tight hover:text-blue-700 transition-colors"
        >
          NewSugar
        </Link>

        <ul className="flex gap-6 items-center text-lg font-medium text-gray-600 relative">
          <li className="relative">
            <Link
              to="/"
              className={`pb-1 transition-colors ${
                isActive("/") ? "text-blue-600" : "hover:text-blue-600"
              }`}
            >
              홈
            </Link>

            {isActive("/") && (
              <div className="absolute left-0 right-0 -bottom-1 h-[2px] bg-blue-600 rounded-full"></div>
            )}
          </li>

          <li className="relative group">
            <Link
              to="#"
              className={`pb-1 transition-colors cursor-pointer ${
                location.pathname.startsWith("/category")
                  ? "text-blue-600"
                  : "hover:text-blue-600"
              }`}
              onClick={(e) => e.preventDefault()}
            >
              카테고리
            </Link>

            {location.pathname.startsWith("/category") && (
              <div className="absolute left-0 right-0 -bottom-1 h-[2px] bg-blue-600 rounded-full"></div>
            )}

            <div
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-md border border-gray-100
                         opacity-0 invisible group-hover:opacity-100 group-hover:visible
                         transition-all duration-200 transform group-hover:translate-y-1 px-4 py-3 w-max"
            >
              <div className="flex gap-3">
               {CATEGORIES.map((cat) => {
                  const slug = getCategorySlug(cat.key); // key 기준으로 slug 생성
                  const isActive = slug === currentCategory;

                  return (
                    <Link
                      key={cat.id}
                      to={`/category/${slug}`}
                      className={`
                        px-4 py-2 rounded-md text-sm whitespace-nowrap transition
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-600 font-semibold border border-blue-200"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }
                      `}
                    >
                      {cat.label} {/* label: 한글 이름 */}
                    </Link>
                  );
                })}
              </div>
            </div>
          </li>

          <li className="relative">
            <Link
              to="/help"
              className={`pb-1 transition-colors ${
                isActive("/help") ? "text-blue-600" : "hover:text-blue-600"
              }`}
            >
              도움말
            </Link>

            {isActive("/help") && (
              <div className="absolute left-0 right-0 -bottom-1 h-[2px] bg-blue-600 rounded-full"></div>
            )}
          </li>
        </ul>

        {isLoggedIn ? (
          <div
            className="relative"
            onMouseEnter={() => setShowProfilePopup(true)}
            onMouseLeave={() => setShowProfilePopup(false)}
          >
            <button
              onClick={() => navigate("/myPage")}
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all object-cover overflow-hidden ${
                isActive("/myPage")
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-600 bg-gray-100"
              }`}
              title="마이페이지"
            >
              <img src={noProfile} alt="noProfile" />
            </button>

            <ProfilePreviewPopup
              user={userProfile ? {
                name: userProfile.name,
                nickname: userProfile.nickname,
                email: userProfile.email,
                phone: userProfile.phone,
              } : null}
              isVisible={showProfilePopup}
            />
          </div>
        ) : (
          <div className="flex gap-3 items-center">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              로그인
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              회원가입
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};
