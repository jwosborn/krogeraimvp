import React, { useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import axios from "axios";

type SyndigoSubmitButtonProps = {
    products: any[],
    URL: string
};

const handleClick = (products: any[], URL) => {
    console.log(products)
    let ProductMap = products.map(product => {
        return {
            "Name": product?.Product_Title,
            "GTIN": product?.UPC,
            "Marketing Copy": product?.description,
            "Customer Facing Size": product?.Size,
        }
    })

    let formatProduct = {
        products:[{
            "GTIN": "00053883224347",
            "Marketing Copy": "test" ,
            "Feature - Benefit Bullet 1": '',
            "Feature - Benefit Bullet 2": 'Testing bullet 2',
            "Feature - Benefit Bullet 3": 'Testing bullet 3',
            "Feature - Benefit Bullet 4": 'Testing bullet 4',
            "Feature - Benefit Bullet 5": 'Testing bullet 5',
            "Feature - Benefit Bullet 6": 'Testing bullet 6',
            

        }]
    }

    axios.post(URL + 'update-products', formatProduct)
}

export const SyndigoSubmitButton = ({ products, URL }: SyndigoSubmitButtonProps) => {
    return (
        <>
        {
            <Button onClick={() => handleClick(products, URL)}> Submit </Button>
        }
        </>
    )};