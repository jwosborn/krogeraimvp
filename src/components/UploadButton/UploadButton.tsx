import React, { useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { CSVToArray } from '../../utils/format';
import { handleImport } from "./UploadButtonFuncs";

type UploadButtonProps = {
    products: object[],
    setProducts: (value: object[]) => void,
    setChoosingSheet: (value: boolean) => void,
    setSheet: (value: string) => void,
    setSheetChoices: (value: string[]) => void,
    setWb: (value: object) => void
};

export const UploadButton = ({ products, setProducts, setChoosingSheet, setSheet, setSheetChoices, setWb }: UploadButtonProps) => {
    return (
        <>
        {!products.length &&
        <FileUpload
            accept=".xlsx, .csv"
            auto
            className="ml-3 my-3"
            customUpload
            chooseLabel="Browse Files"
            mode="basic"
            uploadLabel="Upload Excel File"
            uploadHandler={(e) => handleImport(e, setProducts, setWb, setChoosingSheet, setSheet, setSheetChoices)}
        />}
        </>
    )};