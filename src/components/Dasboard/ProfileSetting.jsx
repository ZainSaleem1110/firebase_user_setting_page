import React, { useState, useEffect } from "react";
import { showMessage } from "../../utils/showMessage";
import UploadImageIcon from "../../assets/images/upload-image-icon.png";
import {
  db,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteUser,
  auth,
  storage,
  ref,
  uploadBytes,
  listAll
} from "../../services/config";
import { useNavigate } from "react-router-dom";

function ProfileSetting() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("userToken");
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [fields, setFields] = useState({
    fullName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNo: "",
    DOB: "",
    gender: "",
    profileImage: "",
    email: "",
    uid: "",
    id: "",
  });
  const [loader, setLoader] = useState(false);
  const [deleteBtnLoader, setDeleteBtnLoader] = useState(false);
  const [profileImage, setProfileImage] = useState("")

  useEffect(() => {
    const getUserInfo = async () => {
      if (userEmail) {
        const fieldsData = fields;
        const userInfo = [];
        const collection_ref = collection(db, "Users");
        const findUserByEmail = query(
          collection_ref,
          where("email", "==", userEmail)
        );
        await getDocs(findUserByEmail)
          .then((res) => {
            res.forEach((user) => {
              userInfo.push({
                id: user.id,
                ...user.data(),
              });
            });
          })
          .catch((err) => {
            console.log(err, "err");
          });
        if (userInfo && userInfo.length > 0) {
          fieldsData.firstName = userInfo[0].firstName;
          fieldsData.middleName = userInfo[0].middleName;
          fieldsData.lastName = userInfo[0].lastName;
          fieldsData.phoneNo = userInfo[0].phoneNo;
          fieldsData.DOB = userInfo[0].DOB;
          fieldsData.gender = userInfo[0].gender;
          fieldsData.email = userInfo[0].email;
          fieldsData.profileImage = userInfo[0].profileImage;
          fieldsData.uid = userInfo[0].uid;
          fieldsData.fullName = `${userInfo[0].firstName} ${userInfo[0].middleName} ${userInfo[0].lastName}`;
          fieldsData.id = userInfo[0].id;
          setFields({ ...fieldsData });
        }
      }
    };
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  const imageUploadProps = {
    name: "file",
    action: "https://builderapi.dfysaas.com/image-upload/upload",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      setImageUploadLoading(true);
      if (info.file.status === "done") {
        showMessage(`${info.file.name} file uploaded successfully`, false);
        const imageURL = info.file.response.url;
        setFields({ ...fields, profileImage: imageURL });
        setImageUploadLoading(false);
      } else if (info.file.status === "error") {
        showMessage(`${info.file.name} file upload failed.`, true);
        setImageUploadLoading(false);
      }
    },
    showUploadList: false, // Set showUploadList to false to hide the flat list
  };

  const addUser = async () => {
    const userInfo = {
      uid: userId,
      email: userEmail,
      fullName: `${fields.firstName} ${fields.middleName} ${fields.lastName}`,
      firstName: fields.firstName,
      middleName: fields.middleName,
      lastName: fields.lastName,
      phoneNo: fields.phoneNo,
      DOB: fields.DOB,
      gender: fields.gender,
      profileImage: fields.profileImage,
    };
    try {
      const docRef = await addDoc(collection(db, "Users"), userInfo);
      if (docRef) {
        setLoader(false);
        showMessage("Profile update successfully.", false);
      }
    } catch (e) {
      setLoader(false);
      showMessage("Profile update failed!", true);
    }
  };

  const updateUser = async () => {
    const userInfo = {
      uid: userId,
      email: userEmail,
      fullName: `${fields.firstName} ${fields.middleName} ${fields.lastName}`,
      firstName: fields.firstName,
      middleName: fields.middleName,
      lastName: fields.lastName,
      phoneNo: fields.phoneNo,
      DOB: fields.DOB,
      gender: fields.gender,
      profileImage: fields.profileImage,
      id: fields.id,
    };
    const updateData = doc(db, "Users", fields.id);
    await updateDoc(updateData, userInfo)
      .then(() => {
        setLoader(false);
        showMessage("Profile update successfully.", false);
      })
      .catch(() => {
        setLoader(false);
        showMessage("Profile update failed.", true);
      });
  };

  const checkUserDataExist = async (findUserBy, value) => {
    const userInfo = [];
    const collection_ref = collection(db, "Users");
    const findUserByEmail = query(
      collection_ref,
      where(findUserBy, "==", value)
    );
    await getDocs(findUserByEmail)
      .then((res) => {
        res.forEach((user) => {
          userInfo.push({
            id: user.id,
            ...user.data(),
          });
        });
      })
      .catch((err) => {
        setLoader(false);
        console.log(err, "err");
      });
    if (userInfo.length > 0) {
      const findEmail = userInfo.find((user) => user.email === userEmail);
      if (findEmail) {
        setFields({ ...fields, uid: findEmail?.uid, id: findEmail.id });
        updateUser();
      } else {
        addUser();
      }
    } else {
      addUser();
    }
  };

  const handleSetting = async () => {
    if (
      (fields.firstName === "" &&
        fields.middleName === "" &&
        fields.lastName === "" &&
        fields.phoneNo === "" &&
        fields.profileImage === "",
      fields.DOB === "" && fields.gender === "")
    ) {
      showMessage("Fields are empty", true);
      setLoader(false);
    } else {
      if (userEmail) {
        checkUserDataExist("email", userEmail);
      } else if (userId) {
        checkUserDataExist("uid", userId);
      } else {
        navigate("/");
      }
    }
  };

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleDeleteUser = () => {
    const user = auth.currentUser;
    deleteUser(user)
      .then(() => {
        setDeleteBtnLoader(false);
        showMessage("Account deleted successfully.", false);
      })
      .catch(() => {
        setDeleteBtnLoader(false);
        showMessage("Credential too old. Login again", true);
      });
    // auth.deleteUser(uid)
  };

  const handleUploadImage = (event) => {
    const bytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
    if (event.target.files[0]) {
      console.log(event.target.files[0]);
      let imagePath = event.target.files[0].name
      setProfileImage(imagePath)
      const imageRef = ref(storage,`images/profileImages/${profileImage}`)
      uploadBytes(imageRef, bytes)
      .then((snapshot) => {
        showMessage("Profile image upload successfully",false)
        setFields({...fields, profileImage: `images/profileImages/${profileImage}`})

      })
      .catch((error)=>{
        showMessage("Profile image upload failed",true)
      })
      .finally(()=>{
        setImageUploadLoading(false)
      })
    }
  }

  return (
    <div className="profile_setting_container">
      <div className="fileUploader">
        <div className="imageWrapper">
          <label for="file-upload" className="custom-file-upload imageUpload">
            {imageUploadLoading === true ? (
              <div className="profile_upload_loader"></div>
            ) : (
              <img
                src={
                  fields.profileImage !== ""
                    ? fields.profileImage
                    : UploadImageIcon
                }
                alt="placeholder upload"
                style={{
                  width: `${fields.profileImage !== "" ? "250px" : "80px"}`,
                  height: `${fields.profileImage !== "" ? "250px" : "80px"}`,
                }}
              />
            )}
          </label>
          <input id="file-upload" type="file" onChange={(event)=>{
            setImageUploadLoading(true)
            handleUploadImage(event)
            }} />
        </div>
          <label for="file-upload" className="custom-file-upload">
            <h3 className="uploadHead">Upload Your Image</h3>
          </label>
      </div>
      <div className="profile_setting_form_container">
        <form className="profile_setting_form">
          <input
            id="name"
            name="firstName"
            value={fields.firstName}
            onChange={(e) => {
              handleChange(e);
            }}
            placeholder="First Name"
          />
          <input
            id="name"
            name="middleName"
            value={fields.middleName}
            onChange={(e) => {
              handleChange(e);
            }}
            placeholder="Middle Name"
          />
          <input
            id="name"
            name="lastName"
            value={fields.lastName}
            onChange={(e) => {
              handleChange(e);
            }}
            placeholder="Last Name"
          />
          <input id="name" name="email" value={userEmail} disabled={true} />
          <input
            id="name"
            name="phoneNo"
            value={fields.phoneNo}
            onChange={(e) => {
              handleChange(e);
            }}
            placeholder="Phone Number"
          />
          <input
            id="name"
            type="date"
            name="DOB"
            value={fields.DOB}
            onChange={(e) => {
              handleChange(e);
            }}
            placeholder="Phone Number"
          />
          <div className="gender_fields gender_container">
            <div className="gender_fields">
              <input
                style={{ width: "20px", height: "20px" }}
                type="radio"
                name="gender"
                id="male"
                value="male"
                onClick={() => {
                  setFields({ ...fields, gender: "male" });
                }}
                checked={fields.gender === "male" ? true : false}
              />
              <label for="male">Male</label>
            </div>
            <div className="gender_fields">
              <input
                style={{ width: "20px", height: "20px" }}
                type="radio"
                name="gender"
                id="female"
                value="female"
                onClick={() => {
                  setFields({ ...fields, gender: "female" });
                }}
                checked={fields.gender === "female" ? true : false}
              />
              <label for="female">Female</label>
            </div>
          </div>
          <button
            className="deleteBtn"
            id="submit"
            onClick={(e) => {
              e.preventDefault();
              setDeleteBtnLoader(true);
              handleDeleteUser();
            }}
          >
            {deleteBtnLoader === true && <div className="loader"></div>}
            Delete Account
          </button>
          <button
            className="profile_save_btn button"
            id="submit"
            onClick={(e) => {
              e.preventDefault();
              setLoader(true);
              handleSetting();
            }}
          >
            {loader === true && <div className="loader"></div>}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetting;
