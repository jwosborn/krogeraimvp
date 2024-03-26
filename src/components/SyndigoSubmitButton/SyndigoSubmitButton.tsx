import React, { useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import axios from "axios";

type SyndigoSubmitButtonProps = {
    products: any[],
    URL: string
};

const parseBullets = (bulletsString: string): { [key: string]: string} => {
    if (bulletsString == undefined){
        return null;
    }
    const bulletsArray = bulletsString.trim().split('\n');
    
    const bulletsJSON = bulletsArray.reduce((acc, bullet, index) => {
        if (index < 5) { // There are only bullets 1 - 6 in Syndigo
            const key = `Feature - Benefit Bullet ${index + 1}`;
            acc[key] = bullet;
        }
        return acc;
    }, {} as { [key: string]: string });
    
    return bulletsJSON;
}

const handleClick = (products: any[], URL) => {

    let formatProduct = {
        products: products.map(product => {
            const bullets = parseBullets(product.bullets);
            return {
                "Product Name": product?.Product_Title,
                "GTIN": product?.UPC,
                "Marketing Copy": product?.description,
                "Customer Facing Size": product?.Size,
                ...bullets,
            }
        })
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