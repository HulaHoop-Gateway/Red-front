// JWT 토큰 디코드 유틸리티
export function decodeJWT(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('JWT 디코딩 실패:', error);
        return null;
    }
}

// 로컬스토리지에서 관리자 정보 가져오기
export function getAdminInfo(): { name: string; id: string } | null {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem('admin_jwt');
    if (!token) return null;

    const decoded = decodeJWT(token);
    if (!decoded) return null;

    return {
        name: decoded.adminName || decoded.name || '관리자',
        id: decoded.sub || decoded.adminId || decoded.id || '',
    };
}
