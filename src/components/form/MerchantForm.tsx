"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 가맹점 데이터 유효성 검사를 위한 Zod 스키마
const schema = z.object({
  merchantCode: z.string().min(1, "가맹점 코드는 필수입니다."),
  merchantName: z.string().min(2, "가맹점명은 2자 이상이어야 합니다."),
  businessId: z.string().min(10, "사업자 번호는 10자여야 합니다."),
  brandCode: z.string().min(1, "브랜드 코드는 필수입니다."), // ✅ 추가
  categoryName: z.string().min(1, "업종명은 필수입니다."),
  registrationDate: z.string().min(1, "계약 시작일은 필수입니다."),
  terminationDate: z.string().min(1, "계약 종료일은 필수입니다."),
  contractStatus: z.enum(["Y", "N"]),
});

type MerchantFormData = z.infer<typeof schema>;

const MerchantForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MerchantFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      merchantCode: data?.merchantCode || "",
      merchantName: data?.merchantName || "",
      businessId: data?.businessId || "",
      brandCode: data?.brandCode || "",
      categoryName: data?.categoryName || "",
      registrationDate: data?.registrationDate || "",
      terminationDate: data?.terminationDate || "",
      contractStatus: data?.contractStatus || "Y",
    },
  });

  const onSubmit = async (formData: MerchantFormData) => {
    try {
      const url =
        type === "update"
          ? `http://localhost:8000/api/merchants/${data.merchantCode}`
          : "http://localhost:8000/api/merchants";
      const method = type === "update" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        // 백엔드에서 반환한 에러 메시지 추출
        const errorMessage = await res.text();
        throw new Error(errorMessage || `${type === "update" ? "수정" : "생성"}에 실패했습니다.`);
      }

      // 성공 시 페이지 새로고침으로 목록 갱신
      window.location.reload();
    } catch (error) {
      console.error(error);
      // 백엔드의 구체적인 에러 메시지 표시
      alert(error instanceof Error ? error.message : "작업에 실패했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-2">
        {type === "update" ? "가맹점 정보 수정" : "새 가맹점 등록"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 가맹점 코드 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">가맹점 코드</label>
          <input
            {...register("merchantCode")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent transition-all"
            placeholder="예: M000000001"
            readOnly={type === "update"}
          />
          {errors.merchantCode && <p className="text-red-500 text-xs mt-1">{errors.merchantCode.message}</p>}
        </div>

        {/* 브랜드 코드 (추가) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">브랜드 코드</label>
          <input
            {...register("brandCode")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent transition-all"
            placeholder="예: BR0001"
          />
          {errors.brandCode && <p className="text-red-500 text-xs mt-1">{errors.brandCode.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">가맹점명</label>
          <input
            {...register("merchantName")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent transition-all"
            placeholder="가맹점 이름을 입력하세요"
          />
          {errors.merchantName && <p className="text-red-500 text-xs mt-1">{errors.merchantName.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">사업자 번호</label>
          <input
            {...register("businessId")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent transition-all"
            placeholder="000-00-00000"
          />
          {errors.businessId && <p className="text-red-500 text-xs mt-1">{errors.businessId.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">업종명</label>
          <input
            {...register("categoryName")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent transition-all"
            placeholder="예: 영화관, 자전거"
          />
          {errors.categoryName && <p className="text-red-500 text-xs mt-1">{errors.categoryName.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">계약 시작일</label>
          <input
            type="date"
            {...register("registrationDate")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent transition-all"
          />
          {errors.registrationDate && <p className="text-red-500 text-xs mt-1">{errors.registrationDate.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">계약 종료일</label>
          <input
            type="date"
            {...register("terminationDate")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent transition-all"
          />
          {errors.terminationDate && <p className="text-red-500 text-xs mt-1">{errors.terminationDate.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">계약 상태</label>
          <select
            {...register("contractStatus")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent transition-all bg-white"
          >
            <option value="Y">Active (정상)</option>
            <option value="N">Terminated (해지)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="bg-red-700 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
        >
          {type === "update" ? "수정 완료" : "등록하기"}
        </button>
      </div>
    </form>
  );
};

export default MerchantForm;
