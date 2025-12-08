import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants/CategoryData';
import { getCategorySlug } from '../utils/getCategorySlug';

export const Navbar = () => {

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-8 py-5 flex justify-between items-center">
        {/* 1. 왼쪽 로고 */}
        <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
          NewSugar
        </Link>
        
        {/* 2. 오른쪽 메뉴 */}
        <ul className="flex gap-10 items-center">
          {/* 홈 메뉴 */}
          <li>
            <Link to="/" className="text-gray-600 text-sm font-medium hover:text-blue-600 transition-colors">
              홈
            </Link>
          </li>
          
          {/* 카테고리 메뉴 (드롭다운) */}
          <li className="relative group">
            <Link to="/categories" className="text-gray-600 text-sm font-medium hover:text-blue-600 transition-colors">
              카테고리
            </Link>
            {/* 드롭다운 내용 */}
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            {CATEGORIES.map((category) => (
                <Link
                key={category}
                to={`/category/${getCategorySlug(category)}`}
                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                {category}
                </Link>
            ))}
            </div>
          </li>
          {/* 로그인 버튼 */}
          <li>
            <Link to="/login" className="text-gray-600 text-sm font-medium hover:text-blue-600 transition-colors">
                로그인
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};