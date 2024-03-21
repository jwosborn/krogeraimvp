import React, { useState, useRef } from "react";

import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Checkbox } from "primereact/checkbox";

const KrogerImageUpload = () => {
  const [data, setData] = useState({
    gtin: "",
    commodityName: "",
    commodityNumber: "",
    image: null,
  });

  const [activeCheckboxIndex, setActiveCheckboxIndex] = useState(null);

  const fileUploadRefs = useRef<any>(
    [...Array(6)].map(() => React.createRef())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  const onUpload = (e) => {
    setData((prevState) => ({ ...prevState, image: e.files }));
  };

  const handleSubmit = () => {
    console.log(data);
  };

  const generateFileUploadFields = () => {
    return fileUploadRefs.current.map((_, index) => (
      <div key={index} className="col-6 mt-4">
        <span className="mb-2 block">Carousel {index + 1} position</span>
        <FileUpload
          id={`fileUpload${index}`}
          uploadHandler={handleSubmit}
          onSelect={onUpload}
          name={`demo[]`}
          accept="image/*"
          maxFileSize={1000000}
          customUpload
          multiple={activeCheckboxIndex === index}
          emptyTemplate={
            <p className="m-0">Drag and drop files here to upload.</p>
          }
        />
        <div className="flex align-items-center mt-2">
          <Checkbox
            inputId={`fileUploadCheckbox${index}`}
            checked={activeCheckboxIndex === index}
            onChange={() => {
              setActiveCheckboxIndex(
                activeCheckboxIndex === index ? null : index
              );
            }}
          />
          <label htmlFor={`fileUploadCheckbox${index}`} className="ml-2">
            Multiple?
          </label>
        </div>
      </div>
    ));
  };

  return (
    <div className="container flex flex-column w-full">
      <h3 className="mb-0 text-center text-2xl uppercase">
        Kroger Image Upload
      </h3>
      <div className="grid">
        <div className="col-12">
          <InputText
            className="w-full h-3rem mt-4"
            value={data.gtin}
            onChange={handleChange}
            name="gtin"
            placeholder="GTIN"
          />
          <InputText
            className="w-full h-3rem mt-4"
            value={data.commodityName}
            onChange={handleChange}
            name="commodityName"
            placeholder="Commodity Name"
          />
          <InputText
            className="w-full h-3rem mt-4"
            value={data.commodityNumber}
            onChange={handleChange}
            name="commodityNumber"
            placeholder="Commodity Number"
          />
        </div>
        {generateFileUploadFields()}
      </div>
    </div>
  );
};

export default KrogerImageUpload;
