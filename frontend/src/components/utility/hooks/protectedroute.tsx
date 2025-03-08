"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Helper } from "@/app/_helper/helper";

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const validateToken = async () => {
        const helper = new Helper();
        const data = await helper.funValidateToken();
        if (!data) {
          router.push("/login");
        } else {
          setLoading(false);
        }
      };
      validateToken();
    }, []);

    if (loading) return <p>Loading...</p>;

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
