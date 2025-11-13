"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 가맹점 데이터 유효성 검사를 위한 Zod 스키마
const schema = z.object({
  merchantName: z.string().min(2, "가맹점명은 2자 이상이어야 합니다."),
  businessId: z.string().min(10, "사업자 번호는 10자여야 합니다."),
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
      merchantName: data?.merchantName || "",
      businessId: data?.businessId || "",
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
          ? `http://localhost:8000/api/merchants/${data.id}`
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
        throw new Error(`${type === "update" ? "수정" : "생성"}에 실패했습니다.`);
      }

      // 성공 시 페이지 새로고침으로 목록 갱신
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("작업에 실패했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold text-center">
        {type === "update" ? "가맹점 정보 수정" : "새 가맹점 생성"}
      </h2>
      
      <div>
        <label>가맹점명</label>
        <input {...register("merchantName")} className="w-full p-2 border rounded-md" />
        {errors.merchantName && <p className="text-red-500 text-sm">{errors.merchantName.message}</p>}
      </div>

      <div>
        <label>사업자 번호</label>
        <input {...register("businessId")} className="w-full p-2 border rounded-md" />
        {errors.businessId && <p className="text-red-500 text-sm">{errors.businessId.message}</p>}
      </div>

      <div>
        <label>업종명</label>
        <input {...register("categoryName")} className="w-full p-2 border rounded-md" />
        {errors.categoryName && <p className="text-red-500 text-sm">{errors.categoryName.message}</p>}
      </div>

      <div>
        <label>계약 시작일</label>
        <input type="date" {...register("registrationDate")} className="w-full p-2 border rounded-md" />
        {errors.registrationDate && <p className="text-red-500 text-sm">{errors.registrationDate.message}</p>}
      </div>

      <div>
        <label>계약 종료일</label>
        <input type="date" {...register("terminationDate")} className="w-full p-2 border rounded-md" />
        {errors.terminationDate && <p className="text-red-500 text-sm">{errors.terminationDate.message}</p>}
      </div>

      <div>
        <label>계약 상태</label>
        <select {...register("contractStatus")} className="w-full p-2 border rounded-md">
          <option value="Y">Active</option>
          <option value="N">Terminated</option>
        </select>
      </div>

      <button type="submit" className="bg-lamaSky text-white py-2 px-4 rounded-md mt-4">
        {type === "update" ? "수정하기" : "생성하기"}
      </button>
    </form>
  );
};

export default MerchantForm;
