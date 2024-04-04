import React, { useState, useRef } from "react";
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
import { SelectButton } from 'primereact/selectbutton';

const KrogerIntakeForm = () => {
  const initialFormState = {
    GTIN: [""],
    commodity: [""],
    subCommodity: [""],
    effectiveDate: null,
    field: [
      { type: "Product Name" },
      { type: "Customer Facing Size" },
      { type: "Marketing Copy" },
      { type: "Feature - Benefit Bullet 1" },
      { type: "Feature - Benefit Bullet 2" },
      { type: "Feature - Benefit Bullet 3" },
      { type: "Feature - Benefit Bullet 4" },
      { type: "Feature - Benefit Bullet 5" },
      { type: "Feature - Benefit Bullet 6" },
      { type: "Feature - Benefit Bullet 7" },
      { type: "Carousel 1" },
      { type: "Carousel 2" },
      { type: "Carousel 3" },
      { type: "Carousel 4" },
      { type: "Carousel 5" },
      { type: "Carousel 6" },
    ],
    userName: "",
    email: "",
    role: [{ name: "Client" }, { name: "Employee" }],
    issue: "",
    files: [],
    isPackImage: false,
    otherEmailsToNotify: [""],
    selectedRole: { name: "" },
    selectedField: { type: "" },
  };

  const [formState, setFormState] = useState(initialFormState);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidInput, setIsValidInput] = useState(true);
  const [selectedRadioBtn, setSelectedRadioBtn] = useState("GTIN");
  const [lastRadioBtnPosition, setLastRadioBtnPosition] =
    useState(selectedRadioBtn);

  const fileUploadRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValidInput(emailRegex.test(value));
    }
  };

  const handleSelect = (e) => {
    const { name, value } = e?.target;

    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleDateChange = (e) => {
    setFormState((prevState) => ({ ...prevState, effectiveDate: e.value }));
  };

  const handleCheckboxChange = (e) => {
    setFormState((prevState) => ({ ...prevState, isPackImage: e.checked }));
  };

  const handleRadioButtonChange = (e) => {
    setSelectedRadioBtn(e.target.value);

    setFormState((prevState) => {
      return { ...prevState, [lastRadioBtnPosition]: [""] };
    });

    setLastRadioBtnPosition(e.target.value);
  };

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  const handleFileUpload = async (e) => {
    const files = Array.from(e.files); // Assuming e.target.files is the FileList
  
    // Convert all files to base64
    const promises = files.map(file => fileToBase64(file));
    const base64Files = await Promise.all(promises);
  
    // Update form state with base64 strings
    setFormState(prevState => ({
      ...prevState,
      files: base64Files.map(base64 => ({ base64 }))
    }));
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
            <span className="block w-full p-float-label h-3rem surface-ground">
              <Chips
                className="w-full h-full"
                value={item}
                onChange={(e) =>
                  handleFieldChange(index, field, e.target.value)
                }
                disabled={
                  field !== "otherEmailsToNotify" && field !== selectedRadioBtn
                }
              />
              <label htmlFor={field}>{title}</label>
            </span>
          </div>
        ))}
      </div>
    );
  };

  const handleSubmit = () => {
    const {
      effectiveDate,
      userName,
      email,
      selectedRole,
      selectedField,
      issue,
      files,
      isPackImage,
      otherEmailsToNotify,
      GTIN,
      commodity,
      subCommodity,
    } = formState;

    let dataIn = {
      GTIN,
      commodity,
      subCommodity,
      effectiveDate: effectiveDate?.toISOString().split('T')[0] || "",
      field: selectedField.type,
      userName,
      email,
      role: selectedRole.name,
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

    setSelectedRadioBtn("GTIN");
    setShowModal(false);
  };

  return (
    <>
      <div className="container flex flex-column w-full">
        <div className="flex flex-row justify-content-center"> 
          <h2>Intake Form</h2>
        </div>
        <div className="flex flex-row justify-content-center"> 
          <p>This form is for change requests to the Kroger website in the following fields: Product Name, Customer Facing Size, Marketing Copy, Feature Bullets, and Carousel Images.</p>
        </div>
        <div className="grid">
            <div className="flex flex-column col-12 col-offset-2 mt-4">
              <div className="col-offset-3">
                <SelectButton
                  value={selectedRadioBtn}
                  onChange={handleRadioButtonChange}
                  options={[{ label: "GTIN", value: "GTIN" }, { label: "Commodity", value: "commodity" }, { label: "Sub Commodity", value: "subCommodity" }]}
                />
            </div>
                <div className="col-offset-1">
                  {handleDymamicFields(selectedRadioBtn, selectedRadioBtn.toUpperCase())}
                  <p>Press enter after typing each value to confirm. This input accepts multiple values.</p>
                </div>
            </div>
          <div className="col-6 mt-4">
            <span className="block w-full p-float-label h-3rem surface-ground">
              <InputText
                className="w-full h-3rem"
                value={formState.userName}
                onChange={handleChange}
                name="userName"
              />
              <label htmlFor="userName">User Name</label>
            </span>
          </div>
          <div className="col-6 mt-4">
            <span className="block w-full p-float-label h-3rem surface-ground">
              <InputText
                className={`w-full h-3rem ${
                  !isValidInput ? "border-2 border-red-500" : ""
                }`}
                value={formState.email}
                onChange={handleChange}
                name="email"
                type="email"
              />
              <label htmlFor="email">Email</label>
            </span>
          </div>
          <div className="col-6 mt-4">
            <Dropdown
              value={formState.selectedRole}
              onChange={handleSelect}
              options={formState.role}
              optionLabel="name"
              placeholder="Select a Role"
              className="w-full h-3rem flex align-items-center"
              name="selectedRole"
            />
          </div>
          <div className="col-6 mt-4">
            <Dropdown
              value={formState.selectedField}
              onChange={handleSelect}
              options={formState.field}
              placeholder="Select a Field"
              optionLabel="type"
              className="w-full h-3rem flex align-items-center"
              name="selectedField"
            />
          {formState.selectedField.type.startsWith('Carousel') && 
            (
                <div className="flex mt-2">
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
            )
          }
          </div>
          <div className="col-6 mt-4">
            <Calendar
              style={{ height: "3rem" }}
              className="w-full"
              value={formState.effectiveDate}
              onSelect={handleDateChange}
              dateFormat="yy-mm-dd"
              showIcon
              name="effectiveDate"
              placeholder="Date this item can be updated. Select today for ASAP."
            />
          </div>
          {handleDymamicFields("otherEmailsToNotify", "Other Emails To Notify")}
          <div className="col-12 mt-4">
            <p>Please write a brief description of the change being requested. Attach files below if needed.</p>
            <span className="block w-full p-float-label h-3rem surface-ground">
              <InputTextarea
                className="w-full"
                value={formState.issue}
                onChange={handleChange}
                name="issue"
                rows={3}
                autoResize
              />
              <label htmlFor="issue">Issue</label>
            </span>
          </div>
          <div className="col-12 mt-4">
            <FileUpload
              ref={fileUploadRef}
              uploadHandler={handleFileUpload}
              name="demo[]"
              multiple
              accept="image/*"
              maxFileSize={10000000}
              customUpload
              auto
              emptyTemplate={
                <p className="m-0">Drag and drop files here to upload.</p>
              }
            />
          </div>
          <div className="col-6 w-full h-4rem mt-4">
          <p>Upon submitting, an email confirmation will be sent to the email(s) listed above as well as the appropriate party responsible for the change. An additional email confirmation will be sent when the change(s) are applied.</p>
            <Button
              severity="success"
              className="h-full px-4 mb-5"
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
