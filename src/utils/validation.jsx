const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

function isEmailAddress(str) {
  return str.match(pattern);
}

const signUpFormValidation = (formData,fieldsName) => {
  const error = {};
  let isValid = true
  const fields = fieldsName;
  fields.forEach((field) => {
    if (!formData[`${field}`]) {
      error[[field]] = `${field} Required`;
      isValid = false
    }
  });

  if (formData.email && isEmailAddress(formData.email) === null) {
    error["email"] = "Not a valid email";
    isValid = false
  }
  // if (Object.keys(error).length === 0) return {error,isValid};
  return {error,isValid};
};

export { signUpFormValidation };
