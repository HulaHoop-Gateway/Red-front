"use client";

import FormModal from "@/components/FormModal";
import { role } from "@/lib/data";
import Image from "next/image";
import { useEffect, useState } from "react";

// 가맹점 데이터 타입을 정의합니다.
interface Merchant {
  id: string;
  merchantCode: string;
  merchantName: string;
  businessId: string;
  categoryName: string;
  registrationDate: string;
  terminationDate: string;
  contractStatus: string;
}

const SingleMerchantPage = ({ params }: { params: { id: string } }) => {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/merchants/${params.id}`
        );
        if (!res.ok) {
          throw new Error("가맹점 정보를 불러오는 데 실패했습니다.");
        }
        const data = await res.json();
        setMerchant({ ...data, id: data.merchantCode }); // id를 merchantCode로 설정
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchant();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex-1 p-4 flex justify-center items-center">
        <p>데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 flex justify-center items-center">
        <p>오류: {error}</p>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="flex-1 p-4 flex justify-center items-center">
        <p>가맹점 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4">
      {/* 상단 정보 카드 */}
      <div className="bg-white p-6 rounded-md shadow-md flex flex-col lg:flex-row gap-6">
        {/* 이미지 */}
        <div className="flex-shrink-0">
          <Image
            src={"/singleBranch.png"} // 가맹점 기본 아이콘
            alt={merchant.merchantName}
            width={144}
            height={144}
            className="w-36 h-36 rounded-full object-cover border-4 border-lamaSky"
          />
        </div>

        {/* 정보 */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{merchant.merchantName}</h1>
            {role === "admin" && (
              <FormModal table="merchant" type="update" data={merchant} />
            )}
          </div>
          <p className="text-gray-600">{merchant.categoryName}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
            <div className="flex flex-col">
              <span className="text-gray-500 font-semibold">가맹점 코드</span>
              <span>{merchant.merchantCode}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 font-semibold">사업자 번호</span>
              <span>{merchant.businessId}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 font-semibold">계약 상태</span>
              <span
                className={`w-fit px-3 py-1 rounded-full text-xs font-semibold ${
                  merchant.contractStatus === "Y"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {merchant.contractStatus === "Y" ? "Active" : "Terminated"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 font-semibold">계약 기간</span>
              <span>{`${merchant.registrationDate} ~ ${merchant.terminationDate}`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 추가 정보 섹션 (향후 확장 가능) */}
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4">추가 정보</h2>
        <p className="text-gray-500">
          이곳에 해당 가맹점과 관련된 추가적인 통계나 정보를 표시할 수
          있습니다.
        </p>
      </div>
    </div>
  );
};

export default SingleMerchantPage;