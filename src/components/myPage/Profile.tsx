import { MdEdit, MdCheck, MdClose, MdEmail } from "react-icons/md";
import type { ChangeEvent } from "react";
import { FaPhoneAlt } from "react-icons/fa";

interface ProfileSectionProps {
  user: {
    name: string;
    nickname: string;
    email: string;
    phone: string | null;
    score: number;
  };
  editForm: {
    name: string;
    nickname: string;
    email: string;
    phone: string | null;
    password: string;
  };
  isEditing: boolean;
  stats: {
    readingStyle: string;
    favoriteCategories: { name: string; count: number }[];
  };
  onEditClick: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ProfileSection = ({
  user,
  editForm,
  isEditing,
  stats,
  onEditClick,
  onSave,
  onCancel,
  onChange,
  onPhoneChange,
}: ProfileSectionProps) => {
  return (
    <section className="mb-12">
      <div className="bg-white border-l-4 border-blue-600 rounded p-6 shadow-sm">
        {isEditing ? (
          /* ===== 편집 모드 ===== */
          <div>
            <div className="space-y-4 mb-6">
              <Input label="이름" name="name" value={editForm.name} onChange={onChange} />
              <Input label="닉네임" name="nickname" value={editForm.nickname} onChange={onChange} />
              <Input label="이메일" name="email" value={editForm.email} disabled />
              <Input
                label="비밀번호"
                name="password"
                type="password"
                value={editForm.password}
                onChange={onChange}
                placeholder="변경하지 않으려면 비워두세요"
              />
              <Input
                label="휴대전화"
                name="phone"
                value={editForm.phone || ""}
                onChange={onPhoneChange}
                placeholder="010-1234-5678"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={onSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded font-medium text-sm"
              >
                <MdCheck size={18} /> 저장
              </button>
              <button
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded font-medium text-sm"
              >
                <MdClose size={18} /> 취소
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex gap-6 items-start">
                <div className="w-24 h-24 flex-shrink-0">
                    <img
                    src={`src/assets/noProfile.png`}
                    alt="프로필 이미지"
                    className="w-full h-full object-cover rounded-md border border-gray-200"
                    />
                </div>

                {/* 텍스트 영역 */}
                <div className="flex-1 flex justify-between">
                    <div>
                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">@{user.nickname}</p>
                    <p className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                        <MdEmail className="text-[10px]" />
                        <span>{user.email}</span>
                    </p>
                    <p className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                        <FaPhoneAlt className="text-[10px]" />
                        <span>{user.phone}</span>
                    </p>
                    </div>

                    <button
                    onClick={onEditClick}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                    >
                    <MdEdit size={20} />
                    </button>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">나의 읽기 성향</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                  #{stats.readingStyle}
                </span>
                {stats.favoriteCategories.map((cat) => (
                  <span
                    key={cat.name}
                    className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs"
                  >
                    #{cat.name}
                    <span className="text-gray-400 text-[10px] ml-1">
                      ({cat.count}회)
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileSection;

/* 공통 Input */
const Input = ({ label, ...props }: any) => (
  <div>
    <label className="text-xs text-gray-500 mb-2 block">{label}</label>
    <input
      {...props}
      className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-600"
    />
  </div>
);