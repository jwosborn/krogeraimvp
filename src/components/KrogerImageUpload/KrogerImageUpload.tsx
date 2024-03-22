import React, { useState, useRef } from "react";
import axios from "axios";

import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Checkbox } from "primereact/checkbox";

const KrogerImageUpload = () => {
  const [data, setData] = useState({
    GTIN: "",
    // commodityName: "",
    // commodityNumber: "",
    image: null,
    position: "",
    multiple: false,
  });

  const [activeCheckboxIndices, setActiveCheckboxIndices] = useState([]);

  const fileUploadRefs = useRef<any>(
    [...Array(6)].map(() => React.createRef())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCheckboxChange = (index) => {
    setActiveCheckboxIndices((currentIndices) => {
      const indexExists = currentIndices.includes(index);

      if (indexExists) {
        return currentIndices.filter((currentIndex) => currentIndex !== index);
      } else {
        return [...currentIndices, index];
      }
    });
  };

  const onUpload = (e) => {
    setData((prevState) => ({ ...prevState, image: e.files }));
  };

  const handleSubmit = (elementId, index) => {
    let dataIn = { ...data, multiple: activeCheckboxIndices.includes(index) };

    if (elementId === "fileUpload0") {
      dataIn = { ...dataIn, position: "Main Product Image" };
    } else {
      dataIn = { ...dataIn, position: "Detailed Product View 1-5" };
    }
    console.log(dataIn);
    // axios({
    //   method: "post",
    //   url: "https://kroger-description-api-0b391e779fb3.herokuapp.com/upload-image",
    //   data: dataIn,
    // })
    //   .then((response) => {
    //     console.log("Form submitted successfully:", response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error submitting form:", error);
    //   })
    //   .finally(() => {});
  };

  const generateFileUploadFields = () => {
    return fileUploadRefs.current.map((_, index) => (
      <div key={index} className="col-6 mt-4">
        <span className="mb-2 block">Carousel {index + 1} position</span>
        <FileUpload
          id={`fileUpload${index}`}
          uploadHandler={() => handleSubmit(`fileUpload${index}`, index)}
          onSelect={onUpload}
          name={`demo[]`}
          accept="image/*"
          maxFileSize={1000000}
          customUpload
          multiple
          emptyTemplate={
            <p className="m-0">Drag and drop files here to upload.</p>
          }
        />
        <div className="flex align-items-center mt-2">
          <Checkbox
            inputId={`fileUploadCheckbox${index}`}
            checked={activeCheckboxIndices.includes(index)}
            onChange={() => handleCheckboxChange(index)}
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
            value={data.GTIN}
            onChange={handleChange}
            name="GTIN"
            placeholder="GTIN"
          />
          {/* <InputText
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
          /> */}
        </div>
        {generateFileUploadFields()}
      </div>
    </div>
  );
};

export default KrogerImageUpload;
