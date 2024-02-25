import React, { useEffect, useState } from "react";
import Header from "./header";
import ProfileSetting from "./ProfileSetting";
import { auth, onAuthStateChanged } from "../../services/config";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      }else{
        setLoading(false)
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading === true ? (
        <div className="spinner">
        <Spin size="large" />
      </div>
      ) : (
        <div className="dashboard_main">
          <Header />
          <ProfileSetting />
        </div>
      )}
    </>
  );
}

export default Dashboard;
