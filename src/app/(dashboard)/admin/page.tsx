import CountChart from "@/components/CountChart"
import UserCard from "@/components/UserCard"

const AdminPage = () => {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/* 왼쪽 */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
      {/* 대시보드 상단 카드 */}
      <div className="flex gap-4 justify-between flex-wrap">
        <UserCard type="회원수"/>
        <UserCard type="가맹점수"/>
        <UserCard type="외부 API 요청건수"/>
        <UserCard type="H/G 처리건수"/>
      </div>
      {/*중간 차트 */}
      <div className="flex gap-4 flex-col lg:flex-row">
        {/* 상태 체크 차트 */}
        <div className="w-full lg:w-1/3 h-[450px]">
        <CountChart/>
        </div>
        {/* 수입 그래프 차트 */}
        <div className="w-full lg:w-2/3 h-[450px]"></div>
      </div>
      {/* 아래 차트 */}
      <div className=""></div>
      </div>
      {/* 오른쪽 */}
      <div className="w-full lg:w-1/3">r</div>
    </div>
  )
}

export default AdminPage