import React, { useState, useRef } from "react";
import axios from "axios";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Chips } from "primereact/chips";
import { Dialog } from "primereact/dialog";

const KrogerImageUpload = () => {
  const [GTIN, setGTIN] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [fileData, setFileData] = useState([]);

  const isSubmitDisabled =
    fileData
      .filter((item) => item?.files)
      .every((item) => item?.files?.length === 0) || isLoading;

  const fileUploadRefs = useRef<any>(
    [...Array(6)].map(() => React.createRef())
  );

  const handleGTINChange = (e) => {
    setGTIN(e.target.value);
  };

  const handleFileUpload = (index, files = []) => {
    const newFileData = [...fileData];
    newFileData[index] = {
      ...newFileData[index],
      files,
      position:
        index === 0 ? "Main Product Image" : `Detailed Product View ${index}`,
    };
    setFileData(newFileData);
  };

  const handleFieldChange = (index, newValueArray) => {
    setFileData((prevState) => {
      const newState = [...prevState];

      newState[index] = {
        ...newState[index],
        UPCs: newValueArray,
      };

      return newState;
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const validFileData = fileData.filter(
      (entry) => entry && entry.files && entry.files.length > 0
    );

    const uploadPromises = validFileData.map(
      ({ files, position, UPCs }, index) => {
        const formData = new FormData();

        formData.append("GTIN", GTIN);
        formData.append("position", position);

        const multiple = validFileData[index].UPCs
          ? validFileData[index].UPCs.length > 1
          : false;

        formData.append("multiple", multiple.toString());
        formData.append("UPCs", UPCs?.join(",") || "");

        files.forEach((file) => formData.append("image", file));

        return axios.post(
          "https://kroger-description-api-0b391e779fb3.herokuapp.com/upload-image",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
    );

    try {
      const responses = await Promise.all(uploadPromises);
      console.log(
        "All forms submitted successfully:",
        responses.map((response) => response.data)
      );

      setShowModal(true);

      if (fileUploadRefs.current) {
        fileUploadRefs.current.forEach((refEl) => {
          refEl.current.clear();
        });
      }

      setFileData([]);
    } catch (error) {
      console.error("Error submitting forms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex flex-column w-full font-main">
        <div className="flex flex-row justify-content-center"> 
          <h2>Image Upload Tool</h2>
        </div>
        <div className="flex flex-column w-full mb-3 bg-yellow-100"> 
        <ul>
          <li className="mb-2">This tool is to be used to upload image files to the carousel on the Kroger website. Please indicate the main GTIN and additional UPC(s) that the image applies to when submitting.</li>
          <li className="mb-2"><span className="text-red-500">*</span>{' '} Indicates a required field.</li>
          <li>When adding additional UPC's, press Enter after each UPC to confirm, much like adding email addresses to an email you are composing.</li>
        </ul>
        </div>
      <div className="grid">
        <div className="col-12">
          <label htmlFor="GTIN">GTIN<span className="text-red-500">*</span></label>
          <InputText
            className="w-full h-3rem mt-4"
            value={GTIN}
            onChange={handleGTINChange}
            name="GTIN"
            placeholder="GTIN"
          />
        </div>
        {fileUploadRefs.current.map((ref, index) => (
          <div key={index} className="col-6 mt-4">
            <span className="mb-2 block">Carousel {index + 1} Position</span>
            <FileUpload
              ref={ref}
              onSelect={(e) => handleFileUpload(index, e?.files)}
              name={`fileUpload${index}`}
              accept="image/*"
              maxFileSize={10000000}
              customUpload
              auto
              onRemove={() =>
                setFileData((prevData) =>
                  prevData.map((item, idx) =>
                    idx === index ? { ...item, files: [] } : item
                  )
                )
              }
              emptyTemplate={
                <p className="m-0">Drag and drop files here to upload.</p>
              }
            />
            <span className="block w-full p-float-label h-3rem my-4">
              <Chips
                className="w-full h-full"
                value={fileData[index]?.UPCs || []}
                onChange={(e) => handleFieldChange(index, e.target.value)}
              />
              <label htmlFor="UPCs">UPCs</label>
            </span>
          </div>
        ))}
        <div className="col-6 w-full h-4rem">
          <Button
            className="h-full px-4 mb-4"
            severity="success"
            onClick={handleSubmit}
            label={isLoading ? "Submitting..." : "Submit"}
            icon={isLoading ? "pi pi-spin pi-spinner" : "pi"}
            disabled={isSubmitDisabled}
          />
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
        onHide={() => setShowModal(false)}
      >
        <div className="card flex flex-wrap flex-column gap-2 justify-content-center">
          <div>
            <Button
              onClick={() => setShowModal(false)}
              icon="pi pi-check"
              label="Ok"
            ></Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default KrogerImageUpload;
