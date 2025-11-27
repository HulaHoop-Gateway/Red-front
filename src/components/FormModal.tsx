"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// LAZY LOADING을 사용하여 폼 컴포넌트를 동적으로 임포트합니다.
const TeacherForm = dynamic(() => import("./form/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./form/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const MerchantForm = dynamic(() => import("./form/MerchantForm"), {
  loading: () => <h1>Loading...</h1>,
});

// 테이블 타입에 따라 렌더링할 폼을 매핑하는 객체입니다.
const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
  merchant: (type, data) => <MerchantForm type={type} data={data} />,
};

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table:
  | "merchant"
  | "student"
  | "parent"
  type: "create" | "update" | "delete";
  data?: any;
  id?: string;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
        ? "bg-lamaSky"
        : "bg-lamaPurple";

  const [open, setOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 삭제 처리 함수
  const handleDelete = async () => {
    if (!id) return;

    try {
      // 테이블 타입에 따라 API 엔드포인트 결정
      let url = `http://localhost:8000/api/${table}s/${id}`;

      // merchant의 경우 id가 merchantCode이므로 그대로 사용
      // 다른 테이블의 경우 id 처리 방식이 다를 수 있음 (필요 시 분기 처리)

      const res = await fetch(url, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("삭제에 실패했습니다.");
      }
      // 성공 시 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("삭제 작업에 실패했습니다.");
    }
  };

  const Form = () => {
    const FormComponent = forms[table];
    return type === "delete" && id ? (
      <div className="p-6 flex flex-col gap-6 items-center justify-center">
        <div className="w-16 h-16 bg-lamaPurple rounded-full flex items-center justify-center mb-2">
          <Image src="/delete.png" alt="delete" width={32} height={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">삭제 확인</h3>
        <p className="text-center text-gray-600">
          정말로 이 {table} 데이터를 삭제하시겠습니까?<br />
          이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex mt-4 w-full justify-center">
          <button
            onClick={handleDelete}
            type="button"
            className="px-6 py-2 rounded-lg bg-red-700 text-white hover:bg-red-600 transition-colors"
          >
            삭제하기
          </button>
        </div>
      </div>
    ) : type === "create" || type === "update" ? (
      FormComponent ? (
        FormComponent(type, data)
      ) : (
        <p className="text-center p-4">
          &quot;{table}&quot;에 대한 폼이 아직 구현되지 않았습니다.
        </p>
      )
    ) : (
      "폼을 찾을 수 없습니다!"
    );
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg relative w-[95%] md:w-[90%] lg:w-[80%] xl:w-[70%] 2xl:w-[60%] shadow-2xl">
        <Form />
        <div
          className="absolute top-4 right-4 cursor-pointer hover:opacity-70 transition-opacity"
          onClick={() => setOpen(false)}
        >
          <Image src="/close.png" alt="" width={14} height={14} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && isClient && createPortal(modalContent, document.body)}
    </>
  );
};

export default FormModal;
