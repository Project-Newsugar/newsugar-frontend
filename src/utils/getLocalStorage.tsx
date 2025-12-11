export const getLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    try {
      // 문자열이면 그대로 저장, 객체면 JSON.stringify
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      window.localStorage.setItem(key, stringValue);
    } catch (err) {
      console.log(err);
    }
  };

  const getItem = () => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return null;

      // JWT 토큰 키인 경우 문자열 그대로 반환
      if (key === 'accessToken' || key === 'refreshToken') {
        return item;
      }

      // 그 외의 경우 JSON 파싱 시도
      try {
        return JSON.parse(item);
      } catch {
        // JSON 파싱 실패 시 문자열 그대로 반환
        return item;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  // ===== 기존 코드 (주석 처리) =====
  // const setItem = (value: unknown) => {
  //   try {
  //     window.localStorage.setItem(key, JSON.stringify(value));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const getItem = () => {
  //   try {
  //     const item = window.localStorage.getItem(key);

  //     return item ? JSON.parse(item) : null;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.log(err);
    }
  };

  return { setItem, getItem, removeItem };
};
