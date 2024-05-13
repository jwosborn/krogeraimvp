import React, { useState, useRef } from "react";
import axios from "axios";

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Chips } from "primereact/chips";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from 'primereact/multiselect';
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Tooltip } from "primereact/tooltip";

const logo = require('../../assets/kroger-logo.png');
const fieldInfo = require('../../assets/intake-form-field-info.png');

const KrogerIntakeForm = () => {
    const initialFormState = {
        GTIN: [""],
        commodity: [""],
        subCommodity: [""],
        effectiveDate: null,
        field: [
            { type: "Product Title" },
            { type: "Customer Facing Size" },
            { type: "Product Description (paragraph and feature bullet points)" },
            { type: "Package Shot Image" },
            { type: "Enhanced Image: MHRI" },
            { type: "Enhanced Image: Carousels" }
        ],
        userName: "",
        email: "",
        role: [
            { name: "Our Brands Brand Manager" },
            { name: "Our Brands CSM/Acceleration Team" },
            { name: "Digital DCM/ADCM" },
            { name: "CTF Regulatory" },
            { name: "Legal" },
            { name: "Supplier" },
            { name: "Other" },
        ],
        specifiedRole: '',
        isHighPriority: false,
        issue: "",
        files: [],
        isEnhancedImage: false,
        otherEmailsToNotify: [""],
        selectedRole: { name: "" },
        selectedFields: [],
    };

    const [formState, setFormState] = useState(initialFormState);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
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
        if (name === "isHighPriority") {
            setFormState((prevState) => ({ ...prevState, isHighPriority: e.value }));
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
        setFormState((prevState) => ({ ...prevState, isEnhancedImage: e.checked }));
    };

    const handleRadioButtonChange = (value) => {
        setSelectedRadioBtn(value);

        setFormState((prevState) => {
            return { ...prevState, [lastRadioBtnPosition]: [""] };
        });
    }

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

    const splitMultipleValues = string => string.split(/(?:, | )/g)

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
                            {field !== 'otherEmailsToNotify' ?
                                <InputText
                                    className="w-full h-full border-round-sm"
                                    value={item}
                                    onChange={(e) =>
                                        handleFieldChange(index, field, e.target.value)
                                    }
                                    disabled={
                                        field !== "otherEmailsToNotify" && field !== selectedRadioBtn
                                    }
                                />
                                :
                                <Chips
                                    className="w-full h-full border-round"
                                    value={item}
                                    onChange={(e) =>
                                        handleFieldChange(index, field, e.target.value)
                                    }
                                    disabled={
                                        field !== "otherEmailsToNotify" && field !== selectedRadioBtn
                                    }
                                />
                            }
                            <label htmlFor={field}>{title}(s){field !== "otherEmailsToNotify" ? <span className="text-red-500">*</span> : ''}</label>
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
            selectedFields,
            issue,
            files,
            isEnhancedImage,
            otherEmailsToNotify,
            GTIN,
            commodity,
            subCommodity,
        } = formState;


        let dataIn = {
            GTIN: splitMultipleValues(GTIN[0]),
            commodity: splitMultipleValues(commodity[0]),
            subCommodity: splitMultipleValues(subCommodity[0]),
            effectiveDate: effectiveDate?.toISOString() || "",
            fields: selectedFields.map(field => field.type),
            userName,
            email,
            role: selectedRole.name,
            issue,
            files,
            isEnhancedImage,
            otherEmailsToNotify,
        };

        if (email === "" || email === null) {
            setIsConfirming(false);
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

        setIsConfirming(false);
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

    const required = (<span className="text-red-500">*</span>)

    return (
        <>
            <div className="font-kroger">
                <img className="max-h-10rem" src={logo} alt="Kroger Logo" />
            </div>
            <div className="container flex flex-column w-11 font-kroger mx-auto border-1 border-gray-100 p-3 border-round-sm">
                <div className="flex flex-row justify-content-center">
                    <h2>PDP Change Request Intake Form</h2>
                </div>
                <Tooltip target=".size-label" position="bottom" >
                    <img className="h-25rem" src={fieldInfo} alt="info on PDP fields" />
                </Tooltip>
                <div className="flex flex-column border-1 border-gray-100 bg-yellow-100 border-round-sm p-4">
                    <p>
                        Please fill out the following form to request changes to Our Brands Product Detail Page
                        (PDP) fields such as product title, description, customer-facing size{' '}<span className="size-label w-max"><i className="pi pi-info-circle"/></span>, and images.
                        Changes will be reflected on site on the provided date or within 10 business days of
                        submission. Confirmation emails will be sent to you and specified relevant parties to confirm
                        receipt of your request and when the changes are implemented.
                    </p>
                </div>
                <div className="grid">
                    <p>{required}{' '} Indicates a required field.</p>
                    <div className="flex flex-column col-12 col-offset-2 mt-4">
                        <div className="col-offset-1">
                            {
                                [{ label: "GTIN", value: "GTIN" }, { label: "Sub Commodity", value: "subCommodity" }, { label: "Commodity", value: "commodity" }].map(field => (
                                    <Button
                                        key={field.value}
                                        label={field.label}
                                        value={field.value}
                                        onClick={() => handleRadioButtonChange(field.value)}
                                        className={`${selectedRadioBtn === field.value ? 'bg-blue-900' : 'bg-gray-200'} p-2 w-2`}
                                    />
                                ))
                            }
                        </div>
                        <div className="col-offset-1">
                            {handleDymamicFields(selectedRadioBtn, selectedRadioBtn.toUpperCase())}
                        </div>
                        <div className="w-8">
                            You can enter GTINs with or without the leading zeros. You can request changes to
                            multiple GTINs, sub-commodities, or commodities at a time by copy and pasting
                            from a spreadsheet, separating them by spaces (# # #), or commas (#,#,#).
                        </div>
                    </div>
                    <div className="col-6 mt-4">
                        <span className="block w-full p-float-label h-3rem surface-ground">
                            <InputText
                                className="w-full h-3rem border-round-sm"
                                value={formState.userName}
                                onChange={handleChange}
                                name="userName"
                            />
                            <label htmlFor="userName">Name{required}</label>
                        </span>
                    </div>
                    <div className="col-6 mt-4">
                        <span className="block w-full p-float-label h-3rem surface-ground">
                            <InputText
                                className={`w-full h-3rem border-round-sm ${isValidInput ? "" : "border-2 border-red-500"
                                    }`}
                                value={formState.email}
                                onChange={handleChange}
                                name="email"
                                type="email"
                            />
                            <label htmlFor="email">Email{required}</label>
                        </span>
                    </div>
                    <div className="col-6 mt-4">
                        <Dropdown
                            value={formState.selectedRole}
                            onChange={handleSelect}
                            options={formState.role}
                            optionLabel="name"
                            placeholder="Select Your Role (required)"
                            className="w-full h-3rem flex align-items-center border-round-sm"
                            name="selectedRole"
                        />
                        {formState.selectedRole.name === 'Other' &&
                            <div className="mt-2">
                                <label className="mr-2">Please Specify:</label>
                                <InputText
                                    className="border-round-sm"
                                    value={formState.specifiedRole}
                                    name="specifiedRole"
                                    onChange={handleChange}
                                />
                            </div>
                        }
                    </div>
                    <div className="col-6 mt-4">
                        <MultiSelect
                            display="chip"
                            value={formState.selectedFields}
                            onChange={handleSelect}
                            options={formState.field}
                            placeholder="Select Field(s)*"
                            optionLabel="type"
                            className="w-full h-3rem flex align-items-center border-round-sm"
                            name="selectedFields"
                        />
                        {formState.selectedFields.some(field => field.type.startsWith('Carousel')) &&
                            (
                                <div className="flex mt-2">
                                    <Checkbox
                                        inputId="isEnhancedImage"
                                        name=""
                                        checked={formState.isEnhancedImage}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label htmlFor="isEnhancedImage" className="ml-2">
                                        Check this box if this is an enhanced image. Do not check if it is a standard pack shot.
                                    </label>
                                </div>
                            )
                        }
                    </div>
                    <div className="col-6 mt-4">
                        <Calendar
                            style={{ height: "3rem" }}
                            className="w-full border-round-sm"
                            value={formState.effectiveDate}
                            onSelect={handleDateChange}
                            dateFormat="yy-mm-dd"
                            showIcon
                            name="effectiveDate"
                            placeholder="Target date for change on site. Select today for ASAP. (required)"
                        />
                    </div>
                    {handleDymamicFields("otherEmailsToNotify", "Other Emails To Recieve Confirmation Emails")}
                    <div className="col-12 mt-3">
                        <p className="mb-3">Write a brief description of the change you are requesting for the PDP field(s) you selected. Include sufficient detail to reduce back-and-forth clarification.{required}</p>
                        <span className="block w-full h-3rem surface-ground">
                            <InputTextarea
                                className="w-full border-round-sm"
                                name="issue"
                                onChange={handleChange}
                                placeholder="Description of the change."
                                rows={3}
                                value={formState.issue}
                            />
                        </span>
                    </div>
                    <div className="col-12 mt-3">
                        <p className="mb-3">Write a brief description of WHY you are requesting this change. This helps us understand the need state and identify any larger issues that need to be solved.</p>
                        <InputTextarea
                            className="w-full border-round-sm"
                            name="reason"
                            onChange={handleChange}
                            placeholder="Why"
                            rows={3}
                            value={formState.issue}
                        />
                    </div>
                    <div className="col-12">
                        <p>Optional: Upload screenshots or files to provide additional clarity on your request (i.e. circle the problem, mockup of your proposed solution).</p>
                        <FileUpload
                            ref={fileUploadRef}
                            uploadHandler={handleFileUpload}
                            name="demo[]"
                            multiple
                            maxFileSize={1000000}
                            customUpload
                            auto
                            emptyTemplate={
                                <p className="m-0">Drag and drop files to here to upload.</p>
                            }
                        />
                    </div>
                    <div className="col-12 mt-4 ">
                        <Tooltip target=".pi-info-circle" />
                        <label className="font-kroger text-2xl mr-4" htmlFor="isHighPriority">
                            High Priority Request?
                            <i
                                className="ml-3 pi pi-info-circle"
                                data-pr-position="top"
                                data-pr-tooltip="High priority requests pose a legal or sales risk to the business if they are not addressed immediately. These will be sent to the top of the queue and may cause delays with other requests." />
                        </label>
                        <InputSwitch name="isHighPriority" checked={formState.isHighPriority} onChange={handleChange} />
                        <p>Does your request qualify as high priority?</p>
                    </div>
                    <div className="col-6 h-4rem">
                        <Button
                            severity="success"
                            className="h-full px-4"
                            onClick={() => setIsConfirming(true)}
                            label={isLoading ? "Submitting..." : "Submit"}
                            icon={isLoading ? "pi pi-spin pi-spinner" : "pi"}
                            disabled={isLoading || !isValidInput}
                        />
                    </div>
                </div>
            </div>
            <Dialog
                header="Are You Sure?"
                visible={isConfirming}
                style={{
                    maxWidth: "350px",
                    width: "100%",
                    textAlign: "center",
                }}
                onHide={() => setIsConfirming(false)}
            >
                <div className="card flex flex-wrap flex-column gap-2 justify-content-center">
                    <div>
                        <Button
                            onClick={() => handleSubmit()}
                            icon="pi pi-check"
                            label="Yes"
                        ></Button>
                        <Button
                            onClick={() => setIsConfirming(false)}
                            icon="pi pi-times"
                            label="No"
                            className="ml-2 p-button-danger"
                        ></Button>
                    </div>
                </div>
            </Dialog>
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
