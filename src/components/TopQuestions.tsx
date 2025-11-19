import { FaQuestionCircle } from 'react-icons/fa';

const topQuestionsData = [
  {
    rank: 1,
    question: "지난 달 가장 이용률이 높았던 가맹점은 어디인가요?",
    bgColor: "bg-red-50",
  },
  {
    rank: 2,
    question: "자전거 이용 내역을 엑셀 파일로 다운로드 받을 수 있나요?",
    bgColor: "bg-blue-50",
  },
  {
    rank: 3,
    question: "H/G 처리건수가 정확히 무엇을 의미하나요?",
    bgColor: "bg-yellow-50",
  },
  {
    rank: 4,
    question: "가맹점별 매출 통계를 볼 수 있나요?",
    bgColor: "bg-green-50",
  },
  {
    rank: 5,
    question: "새로운 자전거 모델을 추가하려면 어떻게 해야 하나요?",
    bgColor: "bg-purple-50",
  },
];

const TopQuestions = () => {
  return (
    <div className="bg-white p-4 rounded-xl h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">AI 문의 TOP 5</h1>
        <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition">
          전체보기
        </span>
      </div>

      {/* 질문 목록 */}
      <div className="flex flex-col gap-3 mt-3">
        {topQuestionsData.map((item) => (
          <div key={item.rank} className={`${item.bgColor} rounded-lg p-3 flex items-center gap-4`}>
            <div className="flex-shrink-0 w-7 h-7 bg-red-600 text-white flex items-center justify-center rounded-full font-bold text-base">
              {item.rank}
            </div>
            <div className="flex-grow flex items-center gap-2">
              <FaQuestionCircle className="text-gray-400" size={20} />
              <p className="text-xs text-gray-700 font-medium">
                {item.question}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopQuestions;
