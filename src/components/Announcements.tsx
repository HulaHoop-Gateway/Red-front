const Announcements = () => {
  return (
    <div className="bg-white p-4 rounded-md">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">공지사항</h1>
        <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition">
          전체보기
        </span>
      </div>

      {/* 공지 목록 */}
      <div className="flex flex-col gap-4 mt-4">
        {/* 공지 1 */}
        <div className="bg-lamaSkyLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">시스템 점검 안내</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2025-10-30
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            서비스 안정화를 위한 서버 점검이 10월 31일 새벽 2시부터 진행될 예정입니다.
          </p>
        </div>

        {/* 공지 2 */}
        <div className="bg-lamaPurpleLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">신규 가맹점 기능 추가</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2025-10-25
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            대시보드 내 가맹점 등록 메뉴가 새롭게 개선되었습니다. 빠르고 간편하게 등록이 가능합니다.
          </p>
        </div>

        {/* 공지 3 */}
        <div className="bg-lamaYellowLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">AI 분석 리포트 오픈</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2025-10-18
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            AI 기반 거래 분석 리포트 기능이 새롭게 추가되었습니다. 이용 통계를 한눈에 확인해보세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
