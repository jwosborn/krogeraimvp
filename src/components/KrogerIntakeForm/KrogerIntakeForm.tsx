import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { FileUpload } from "primereact/fileupload";
import { Dropdown } from 'primereact/dropdown';

const KrogerIntakeForm = () => {
    const [formState, setFormState] = useState({
        gtin: [""],
        commodity: [""],
        subCommodity: [""],
        effectiveDate: null,
        field: "",
        userName: "",
        email: "",
        role: [
            { name: 'Client' },
            { name: 'Employee' },
        ],
        issue: "",
        files: [],
        isPackImage: false,
        selectedRole: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSelectRole = (selectedRole) => {
        setFormState(prevState => ({
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

        const handleAddFields = (field) => {
            setFormState((prevState) => ({
                ...prevState,
                [field]: [...prevState[field], ""],
            }));
        };

        const handleRemoveFields = (field, index) => {
            setFormState((prevState) => ({
                ...prevState,
                [field]: prevState[field].filter((_, item) => item !== index),
            }));
        };

        const handleFieldChange = (index, name, value) => {
            setFormState((prevState) => ({
                ...prevState,
                [name]: prevState[name].map((item, i) => (i === index ? value : item)),
            }));
        };

        return (
            <>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="w-full h-3rem flex align-items-center justify-content-between relative mt-4"
                    >
                        <InputText
                            className="w-full h-3rem pr-5"
                            value={item}
                            onChange={(e) => handleFieldChange(index, field, e.target.value)}
                            placeholder={title}
                        />
                        <div className="absolute right-0 mr-2 cursor-pointer flex items-center">
                            {items.length > 1 && index > 0 && (
                                <i
                                    onClick={() => handleRemoveFields(field, index)}
                                    className="pi pi-times"
                                    style={{
                                        fontSize: "1.1rem",
                                        color: "red",
                                        fontWeight: "bold",
                                    }}
                                ></i>
                            )}
                            {index === 0 && (
                                <i
                                    onClick={() => handleAddFields(field)}
                                    className="pi pi-plus"
                                    style={{
                                        fontSize: "1.1rem",
                                        color: "green",
                                        fontWeight: "bold",
                                    }}
                                ></i>
                            )}
                        </div>
                    </div>
                ))}
            </>
        );
    };

    const handleSubmit = () => {
        console.log(formState);
    };

    return (
        <div className="container flex flex-column max-w-24rem w-full">
            <h2>Submit Your Form</h2>
            {handleDymamicFields("gtin", "GTIN")}
            {handleDymamicFields("commodity", "Commodity")}
            {handleDymamicFields("subCommodity", "SubCommodity")}
            <div className="mt-4">
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
            <div className="mt-4">
                <InputText
                    className="w-full h-3rem"
                    value={formState.field}
                    onChange={handleChange}
                    name="field"
                    placeholder="Field"
                />
            </div>
            <div className="mt-4">
                <InputText
                    className="w-full h-3rem"
                    value={formState.userName}
                    onChange={handleChange}
                    name="userName"
                    placeholder="User Name"
                />
            </div>
            <div className="mt-4">
                <InputText
                    className="w-full h-3rem"
                    value={formState.email}
                    onChange={handleChange}
                    name="email"
                    placeholder="Email"
                />
            </div>
            <div className="mt-4">
                <Dropdown value={formState.selectedRole} onChange={(e) => handleSelectRole(e.value)} options={formState.role} optionLabel="name"
                    placeholder="Select a Role" className="w-full h-3rem flex align-items-center" />
            </div>
            <div className="mt-4">
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
            <div className="mt-4">
                <FileUpload
                    uploadHandler={handleFileUpload}
                    name="demo[]"
                    multiple
                    accept="image/*"
                    maxFileSize={1000000}
                    auto
                    customUpload
                    emptyTemplate={
                        <p className="m-0">Drag and drop files to here to upload.</p>
                    }
                />
            </div>
            <div className="flex align-items-center mt-4">
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
            <div className="w-full h-3rem mt-4">
                <Button
                    className="w-full h-full px-4"
                    onClick={handleSubmit}
                    label="Submit"
                    icon="pi"
                />
            </div>
        </div>
    );
};

export default KrogerIntakeForm;
