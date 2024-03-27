import React, { useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";

type SyndigoSubmitButtonProps = {
    products: any[],
    URL: string,
    buttonText: string
};

export const SyndigoSubmitButton = ({ products, URL, buttonText }: SyndigoSubmitButtonProps) => {
    const [showDialog, setShowDialog] = useState(false);
    const [showTitles, setShowTitles] = useState([]);

    const parseBullets = (bulletsString: string): { [key: string]: string} => {
        if (bulletsString === undefined){
            return null;
        }
        const bulletsArray = bulletsString.trim().split('\n');
        
        const bulletsJSON = bulletsArray.reduce((acc, bullet, index) => {
            if (index < 6) { // There are only bullets 1 - 6 in Syndigo
                const key = `Feature - Benefit Bullet ${index + 1}`;
                acc[key] = bullet;
            }
            return acc;
        }, {} as { [key: string]: string });
        
        return bulletsJSON;
    }

    const ProductTitles = () => {
        return (
          <div style={{border: '1px solid #ccc', margin: '10px', padding: '10px'}}>
            {showTitles.map((product, index) => (
                <p key={index} style={{ margin: 0, padding: '5px 0' }}>
                {product || 'Unnamed Product'}
                </p>
            ))}
          </div>
        );
      };
    
    const handleDialog = (products: any[]) => {
        setShowDialog(true)
        
        // Ensure products is always an array
        const productsArray = Array.isArray(products) ? products : [products];

        setShowTitles(productsArray?.map((product, index) => (
            product.Product_Title || 'Unnamed Product'
        )));
    }

    const handleClick = (products: any[], URL) => {
        setShowDialog(true);
    
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


    return (
        <>
            <Button onClick={() => handleDialog(products)}> {buttonText} </Button>
            <Dialog 
                visible={showDialog}
                style={{ width: '30vw', height: '15vw' }}
                onHide={() => setShowDialog(false)}
            > Are you sure you want to submit the following to Syndigo?
                {ProductTitles()}
                <Button
                    className="p-button-primary generate-button my-3 ml-3 align-items-end"
                    icon="pi pi-check"
                    label="Submit"
                    onClick={() => handleClick(products, URL)}
                />
                <Button
                    className="p-button-danger ml-3 my-3 align-items-end"
                    icon="pi pi-ban"
                    label="Cancel"
                    onClick={() => setShowDialog(false)}
                />
            </Dialog>
        </>
    )};