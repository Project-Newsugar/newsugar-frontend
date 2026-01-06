import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import noProfile from "../assets/noProfile.png";

interface ProfilePreviewPopupProps {
  user: {
    name: string;
    nickname: string;
    email: string;
    phone: string | null;
  } | null;
  isVisible: boolean;
}

export const ProfilePreviewPopup = ({
  user,
  isVisible,
}: ProfilePreviewPopupProps) => {
  return (
    <div
      className={`absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200
                 transition-all duration-200 transform w-64 z-50
                 ${
                   isVisible
                     ? "opacity-100 visible translate-y-1"
                     : "opacity-0 invisible -translate-y-1"
                 }`}
    >
      {/* 말풍선 꼬리 - 버튼 중앙(20px)을 가리킴 */}
      <div className="absolute -top-2 left-2.5 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>

      {/* 팝업 내용 */}
      <div className="relative bg-white rounded-xl p-4">
        {user ? (
          <div className="flex gap-3 items-start">
            {/* 프로필 이미지 */}
            <div className="w-12 h-12 flex-shrink-0">
              <img
                src={noProfile}
                alt="프로필 이미지"
                className="w-full h-full object-cover rounded-md border border-gray-200"
              />
            </div>

            {/* 텍스트 영역 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">
                {user.name}
              </h3>
              <p className="text-gray-600 text-xs mt-0.5 truncate">
                @{user.nickname}
              </p>
              <p className="flex items-center gap-1 text-gray-500 text-xs mt-1.5 truncate">
                <MdEmail className="text-[10px] flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
              {user.phone && (
                <p className="flex items-center gap-1 text-gray-500 text-xs mt-1 truncate">
                  <FaPhoneAlt className="text-[10px] flex-shrink-0" />
                  <span className="truncate">{user.phone}</span>
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="h-16"></div>
        )}
      </div>
    </div>
  );
};
