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
        const key = `Feature - Benefit Bullet ${index + 1}`;
        acc[key] = bullet;
        return acc;
    }, {} as { [key: string]: string });
    
    // console.log(bulletsJSON);
    return bulletsJSON;
}

const handleClick = (products: any[], URL) => {
    
    // console.log(products)
    let ProductMap = products.map(product => {
        const bullets = parseBullets(product.bullets);
        return {
            "Product Name": product?.Product_Title,
            "GTIN": product?.UPC,
            "Marketing Copy": product?.description,
            "Customer Facing Size": product?.Size,
            ...bullets,
        }
    })

    console.log(ProductMap);

    let formatProduct = {
        products:[{
            "GTIN": "00053883224347",
            "Marketing Copy": "test" ,
            "Feature - Benefit Bullet 1": 'Testing bullet 1',
            "Feature - Benefit Bullet 2": 'Testing bullet 2',
            "Feature - Benefit Bullet 3": 'Testing bullet 3',
            "Feature - Benefit Bullet 4": 'Testing bullet 4',
            "Feature - Benefit Bullet 5": 'Testing bullet 5',
            "Feature - Benefit Bullet 6": 'Testing bullet 6',
            

        }]
    }

    // axios.post(URL + 'update-products', ProductMap)
}

export const SyndigoSubmitButton = ({ products, URL }: SyndigoSubmitButtonProps) => {
    return (
        <>
        {
            <Button onClick={() => handleClick(products, URL)}> Submit </Button>
        }
        </>
    )};