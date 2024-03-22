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

  const [listUPS, setListUPS] = useState(
    fileUploadRefs.current.map(() => ({
      listUPS: [""],
    }))
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

  const handleSubmit = (elementId, index, field) => {
    let dataIn = {
      ...data,
      multiple: activeCheckboxIndices.includes(index),
      listUPS: listUPS[index]["listUPS"],
    };

    if (elementId === "fileUpload0") {
      dataIn = { ...dataIn, position: "Main Product Image" };
    } else {
      dataIn = { ...dataIn, position: "Detailed Product View 1-5" };
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

    console.log(dataIn);
    // axios({
    //   method: "post",
    //   url: "https://kroger-description-api-0b391e779fb3.herokuapp.com/upload-image",
    //   data: dataIn,
    // })
    //   .then((response) => {
    //     console.log("Form submitted successfully:", response.data);
    //     field.current.clear();
    //   })
    //   .catch((error) => {
    //     console.error("Error submitting form:", error);
    //   })
    //   .finally(() => {});
  };

  const handleDymamicFields = (field, title, fieldIndex) => {
    const items = listUPS[fieldIndex][field];

    const handleAddFields = (field) => {
      setListUPS((prevState) => {
        const newState = [...prevState];

        newState[fieldIndex] = {
          ...newState[fieldIndex],
          [field]: [...newState[fieldIndex][field], ""],
        };

        return newState;
      });
    };

    const handleRemoveFields = (field, index) => {
      setListUPS((prevState) => {
        const newState = [...prevState];

        newState[fieldIndex] = {
          ...newState[fieldIndex],
          [field]: newState[fieldIndex][field].filter((_, i) => i !== index),
        };

        return newState;
      });
    };

    const handleFieldChange = (field, index, value) => {
      setListUPS((prevState) => {
        const newState = [...prevState];

        if (newState[fieldIndex]) {
          newState[fieldIndex] = {
            ...newState[fieldIndex],
            [field]: newState[fieldIndex][field]?.map((item, i) =>
              i === index ? value : item
            ),
          };
        } else {
          console.warn(`Item at index ${fieldIndex} does not exist.`);
        }

        return newState;
      });
    };

    return (
      <div className="w-12">
        {items.map((item, index) => (
          <div
            key={index}
            className="w-full h-3rem flex align-items-center justify-content-between relative mt-4"
          >
            <InputText
              className="w-full h-3rem pr-5"
              value={item}
              onChange={(e) => handleFieldChange(field, index, e.target.value)}
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
      </div>
    );
  };

  const generateFileUploadFields = () => {
    return fileUploadRefs.current.map((ref, index) => (
      <div key={index} className="col-6 mt-4">
        <span className="mb-2 block">Carousel {index + 1} position</span>
        <FileUpload
          ref={ref}
          id={`fileUpload${index}`}
          uploadHandler={() => handleSubmit(`fileUpload${index}`, index, ref)}
          onSelect={onUpload}
          name={`demo[]`}
          accept="image/*"
          maxFileSize={1000000}
          customUpload
          multiple
          uploadOptions={{ label: "Send" }}
          emptyTemplate={
            <p className="m-0">Drag and drop files here to upload.</p>
          }
        />
        {handleDymamicFields("listUPS", "List UPS", index)}
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
