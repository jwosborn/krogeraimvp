import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { FileUpload } from "primereact/fileupload";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Chips } from "primereact/chips";

const KrogerIntakeForm = () => {
  const initialFormState = {
    gtin: [""],
    commodity: [""],
    subCommodity: [""],
    effectiveDate: null,
    field: "",
    userName: "",
    email: "",
    role: [{ name: "Client" }, { name: "Employee" }],
    issue: "",
    files: [],
    isPackImage: false,
    otherEmailsToNotify: [""],
    selectedRole: "",
  };

  const [formState, setFormState] = useState(initialFormState);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidInput, setIsValidInput] = useState(true);

  const fileUploadRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValidInput(emailRegex.test(value));
    }
  };

  const handleSelectRole = (selectedRole) => {
    setFormState((prevState) => ({
      ...prevState,
      selectedRole: selectedRole,
    }));
  };

  const handleDateChange = (e) => {
    setFormState((prevState) => ({ ...prevState, effectiveDate: e.value }));
  };

  const handleCheckboxChange = (e) => {
    setFormState((prevState) => ({ ...prevState, isPackImage: e.checked }));
  };

  const handleFileUpload = (e) => {
    setFormState((prevState) => ({ ...prevState, files: e.files }));
  };

  const handleDymamicFields = (field, title) => {
    const items = formState?.[field];

    const handleFieldChange = (index, field, value) => {
      setFormState((prevState) => ({
        ...prevState,
        [field]: prevState[field].map((item, i) =>
          i === index ? value : item
        ),
      }));
    };

    return (
      <div className="col-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="w-full h-3rem flex align-items-center justify-content-between relative mt-4"
          >
            <span className="block w-full p-float-label h-3rem">
              <Chips
                className="w-full h-full"
                value={item}
                onChange={(e) =>
                  handleFieldChange(index, field, e.target.value)
                }
              />
              <label htmlFor="username">{title}</label>
            </span>
          </div>
        ))}
      </div>
    );
  };

  const handleSubmit = () => {
    const {
      gtin,
      commodity,
      subCommodity,
      effectiveDate,
      field,
      userName,
      email,
      selectedRole,
      issue,
      files,
      isPackImage,
      otherEmailsToNotify,
    } = formState;

    let dataIn = {
      GTIN: gtin,
      commodity,
      subCommodity,
      effectiveDate: effectiveDate?.toISOString() || "",
      field,
      userName,
      email,
      role: selectedRole,
      issue,
      files,
      isPackImage,
      otherEmailsToNotify,
    };

    if (email === "" || email === null) {
      setIsValidInput(false);
      return;
    }

    const entries = Object.entries(dataIn);

    for (const [key, value] of entries) {
      if (Array.isArray(value)) {
        dataIn = {
          ...dataIn,
          [key]: value.filter((item) => item !== ""),
        };
      }
    }

    setIsLoading(true);

    axios({
      method: "post",
      url: "https://kroger-description-api-0b391e779fb3.herokuapp.com/kroger-intake-form",
      data: dataIn,
    })
      .then((response) => {
        setShowModal(true);
        console.log("Form submitted successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onCloseModal = ({ isAnotherIssue }) => {
    if (isAnotherIssue) {
      setFormState({
        ...initialFormState,
        userName: formState.userName,
        email: formState.email,
        selectedRole: formState.selectedRole,
      });
    } else {
      setFormState(initialFormState);
    }

    if (fileUploadRef.current) {
      fileUploadRef.current.clear();
    }

    setShowModal(false);
  };

  return (
    <>
      <div className="container flex flex-column w-full">
        <h3 className="mb-0 text-center text-2xl uppercase">Intake Form</h3>
        <div className="grid">
          {handleDymamicFields("gtin", "GTIN")}
          {handleDymamicFields("commodity", "Commodity")}
          {handleDymamicFields("subCommodity", "SubCommodity")}
          <div className="col-6 mt-4">
            <Calendar
              style={{ height: "3rem" }}
              className="w-full"
              value={formState.effectiveDate}
              onSelect={handleDateChange}
              dateFormat="yy-mm-dd"
              showIcon
              name="effectiveDate"
              placeholder="Effective Date"
            />
          </div>
          <div className="col-6 mt-4">
            <InputText
              className="w-full h-3rem"
              value={formState.field}
              onChange={handleChange}
              name="field"
              placeholder="Field"
            />
          </div>
          <div className="col-6 mt-4">
            <InputText
              className="w-full h-3rem"
              value={formState.userName}
              onChange={handleChange}
              name="userName"
              placeholder="User Name"
            />
          </div>
          <div className="col-6 mt-4">
            <InputText
              className={`w-full h-3rem ${
                !isValidInput ? "border-red-500" : ""
              }`}
              value={formState.email}
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="col-6 mt-4">
            <Dropdown
              value={formState.selectedRole}
              onChange={(e) => handleSelectRole(e.value)}
              options={formState.role}
              optionLabel="name"
              placeholder="Select a Role"
              className="w-full h-3rem flex align-items-center"
            />
          </div>
          {handleDymamicFields("otherEmailsToNotify", "Other Emails To Notify")}
          <div className="col-6 mt-4">
            <InputTextarea
              className="w-full"
              value={formState.issue}
              onChange={handleChange}
              name="issue"
              rows={3}
              autoResize
              placeholder="Issue"
            />
          </div>
          <div className="col-12 mt-4">
            <FileUpload
              ref={fileUploadRef}
              uploadHandler={handleFileUpload}
              name="demo[]"
              multiple
              accept="image/*"
              maxFileSize={1000000}
              customUpload
              auto
              emptyTemplate={
                <p className="m-0">Drag and drop files to here to upload.</p>
              }
            />
          </div>
          <div className="col-12 flex align-items-center mt-4">
            <Checkbox
              inputId="isPackImage"
              name=""
              checked={formState.isPackImage}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="isPackImage" className="ml-2">
              Pack Image?
            </label>
          </div>
          <div className="col-6 w-full h-4rem mt-4">
            <Button
              className="w-full h-full px-4"
              onClick={handleSubmit}
              label={isLoading ? "Submitting..." : "Submit"}
              icon={isLoading ? "pi pi-spin pi-spinner" : "pi"}
              disabled={isLoading || !isValidInput}
            />
          </div>
        </div>
      </div>
      <Dialog
        header="Form submitted successfully!"
        visible={showModal}
        style={{
          maxWidth: "350px",
          width: "100%",
          textAlign: "center",
        }}
        onHide={() => onCloseModal({ isAnotherIssue: false })}
      >
        <div className="card flex flex-wrap flex-column gap-2 justify-content-center">
          <p>Enter another issue?</p>
          <div>
            <Button
              onClick={() => onCloseModal({ isAnotherIssue: true })}
              icon="pi pi-check"
              label="Yes"
            ></Button>
            <Button
              onClick={() => onCloseModal({ isAnotherIssue: false })}
              icon="pi pi-times"
              label="No"
              className="ml-2 p-button-danger"
            ></Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default KrogerIntakeForm;
