import React, { useState } from "react";
import { Button } from "primereact/button";
import { generateDescriptions } from "./RunAllButtonFuncs";

type RunAllButtonProps = {
    URL: string,
    products: object[],
    setProducts: (value: object[]) => void,
    setLoading: (value: boolean) => void,
    setGenerated: (value: boolean) => void,
    setError: (value: boolean) => void,
};

export const RunAllButton = ({ URL, products, setProducts, setLoading, setGenerated, setError }: RunAllButtonProps) => {

    return (
        <Button
            className="p-button-primary generate-button my-3 ml-3"
            icon="pi pi-check"
            label="Run All Descriptions"
            onClick={() => generateDescriptions(products, setLoading, setProducts, URL, setGenerated, setError)}
        />
    )};