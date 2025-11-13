"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

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
    | "user"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
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

  // 삭제 처리 함수
  const handleDelete = async () => {
    if (!id) return;

    try {
      const res = await fetch(`http://localhost:8000/api/merchants/${id}`, {
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
      <div className="p-4 flex flex-col gap-4">
        <span className="text-center font-medium">
          모든 데이터가 삭제됩니다. 정말로 이 {table}을(를) 삭제하시겠습니까?
        </span>
        <button
          onClick={handleDelete}
          type="button" // form의 submit을 방지
          className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
        >
          삭제
        </button>
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

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
