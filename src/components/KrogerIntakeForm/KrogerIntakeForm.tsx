import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { FileUpload } from 'primereact/fileupload';

const KrogerIntakeForm = () => {
    const [formState, setFormState] = useState({
        gtin: [''],
        commodity: [''],
        subCommodity: [''],
        effectiveDate: null,
        field: '',
        userName: '',
        email: '',
        role: '',
        issue: '',
        files: [],
        isPackImage: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleDateChange = (e) => {
        setFormState(prevState => ({ ...prevState, effectiveDate: e.value }));
    };

    const handleCheckboxChange = (e) => {
        setFormState(prevState => ({ ...prevState, isPackImage: e.checked }));
    };

    const handleFileUpload = (e) => {
        setFormState(prevState => ({ ...prevState, files: e.files }));
    };

    const handleDymamicFields = (field, title) => {
        const items = formState?.[field];

        const handleAddFields = (field) => {
            setFormState(prevState => ({
                ...prevState,
                [field]: [...prevState[field], '']
            }));
        };

        const handleRemoveFields = (field, index) => {
            setFormState(prevState => ({
                ...prevState,
                [field]: prevState[field].filter((_, item) => item !== index)
            }));
        };

        const handleFieldChange = (index, name, value) => {
            setFormState(prevState => ({
                ...prevState,
                [name]: prevState[name].map((item, i) => i === index ? value : item),
            }));
        };

        return (
            <>
                {items.map((item, index) => (
                    <div key={index} className="h-3rem flex align-items-center justify-content-center relative mt-4">
                        <InputText
                            className="w-full h-3rem px-2"
                            value={item}
                            onChange={(e) => handleFieldChange(index, field, e.target.value)}
                            placeholder={title}
                        />
                        <div className="absolute right-0 -mr-6">
                            {items.length > 1 && index > 0 && <Button
                                severity="danger" rounded
                                icon="pi pi-minus"
                                onClick={() => handleRemoveFields(field, index)}
                                className="w-2rem h-2rem"
                            />}
                            {index === 0 && <Button
                                severity="success" rounded
                                icon="pi pi-plus"
                                onClick={() => handleAddFields(field)}
                                className="w-2rem h-2rem p-button-success"
                            />}
                        </div>
                    </div>
                ))}

            </>
        )
    }

    const handleSubmit = () => {
        console.log(formState)
    }

    return (
        <div className="container flex flex-column max-w-24rem w-full">
            <h2>Submit Your Form</h2>
            {handleDymamicFields('gtin', 'GTIN')}
            {handleDymamicFields('commodity', 'Commodity')}
            {handleDymamicFields('subCommodity', 'SubCommodity')}
            <div className="mt-4">
                <Calendar style={{ height: '3rem' }} className='w-full' value={formState.effectiveDate} onSelect={handleDateChange} dateFormat="yy-mm-dd" showIcon name="effectiveDate" />
            </div>
            <div className="mt-4">
                <InputTextarea className='w-full' value={formState.issue} onChange={handleChange} name="issue" rows={3} autoResize />
            </div>
            <div className="mt-4">
                <FileUpload uploadHandler={handleFileUpload} name="demo[]" multiple accept="image/*" maxFileSize={1000000} auto customUpload emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
            </div>
            <div className="flex align-items-center mt-4">
                <Checkbox inputId="isPackImage" name="" checked={formState.isPackImage} onChange={handleCheckboxChange} />
                <label htmlFor="isPackImage" className="ml-2">Pack Image?</label>
            </div>
            <div className="w-full h-3rem mt-4">
                <Button className="w-full h-full px-4" onClick={handleSubmit} label="Submit" icon="pi" />
            </div>
        </div>
    );
};

export default KrogerIntakeForm;