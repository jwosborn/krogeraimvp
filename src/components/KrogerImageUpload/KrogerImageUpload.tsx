import React, { useState, useRef } from "react";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Checkbox } from "primereact/checkbox";

const KrogerImageUpload = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fileUploadRefs = useRef<any>(
    [...Array(6)].map(() => React.createRef())
  );

  const generateFileUploadFields = () => {
    return fileUploadRefs.current.map((ref, index) => (
      <div key={index} className="col-6 mt-4">
        <span className="mb-2 block">Carousel {index + 1} position</span>
        <FileUpload
          ref={ref}
          uploadHandler={() => {}}
          name={`demo[]`}
          multiple
          accept="image/*"
          maxFileSize={1000000}
          customUpload
          emptyTemplate={
            <p className="m-0">Drag and drop files here to upload.</p>
          }
        />
        <div className="flex align-items-center mt-2">
          <Checkbox
            inputId="isPackImage"
            name=""
            checked={false}
            onChange={() => {}}
          />
          <label htmlFor="isPackImage" className="ml-2">
            Multiple SKU?
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
            value={""}
            onChange={() => {}}
            name="gtin"
            placeholder="GTIN"
          />
          <InputText
            className="w-full h-3rem mt-4"
            value={""}
            onChange={() => {}}
            name="commodityName"
            placeholder="Commodity Name"
          />
          <InputText
            className="w-full h-3rem mt-4"
            value={""}
            onChange={() => {}}
            name="commodityNumber"
            placeholder="Commodity Number"
          />
        </div>
        {generateFileUploadFields()}
      </div>
      {/* <div className="w-full h-4rem mt-4">
        <Button
          className="w-full h-full"
          onClick={() => {}}
          label={isLoading ? "Submitting..." : "Submit"}
          icon={isLoading ? "pi pi-spin pi-spinner" : "pi"}
          disabled={isLoading}
        />
      </div> */}
    </div>
  );
};

export default KrogerImageUpload;
