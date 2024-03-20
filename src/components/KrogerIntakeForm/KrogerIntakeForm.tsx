import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { FileUpload } from 'primereact/fileupload';

const KrogerIntakeForm = () => {
    const [formState, setFormState] = useState({
        gtin: '',
        commodity: '',
        subCommodity: '',
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

    const handleSubmit = () => {
        console.log(formState)
    }

    return (
        <div className="container flex flex-column max-w-24rem w-full">
            <h3>Submit Your Form</h3>
            <div>
                <InputText className='w-full' value={formState.gtin} onChange={handleChange} name="gtin" placeholder="GTIN" />
            </div>
            <div className="mt-4">
                <InputText className='w-full' value={formState.commodity} onChange={handleChange} name="commodity" placeholder="Commodity" />
            </div>
            <div className="mt-4">
                <Calendar className='w-full' value={formState.effectiveDate} onSelect={handleDateChange} dateFormat="yy-mm-dd" showIcon name="effectiveDate" />
            </div>
            <div className="mt-4">
                <InputTextarea className='w-full' value={formState.issue} onChange={handleChange} name="issue" rows={3} autoResize />
            </div>
            <div className="mt-4">
                <FileUpload uploadHandler={handleFileUpload} name="demo[]" multiple accept="image/*" maxFileSize={1000000} auto customUpload emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />

            </div>
            <div className="flex align-items-center mt-4">
                <Checkbox className='mr-2' inputId="isPackImage" checked={formState.isPackImage} onChange={handleCheckboxChange} />
                <label htmlFor="isPackImage">Is Pack Image?</label>
            </div>
            <div className="mt-4">
                <Button onClick={handleSubmit} label="Submit" icon="pi pi-check" />
            </div>
        </div>
    );
};

export default KrogerIntakeForm;