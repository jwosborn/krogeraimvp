import React, { useState } from "react";
import { Button } from "primereact/button";
import axios from "axios";
import { Dialog } from "primereact/dialog";

type SyndigoSubmitButtonProps = {
    products: any[],
    URL: string,
    buttonText: string
};

export const SyndigoSubmitButton = ({ products, URL, buttonText }: SyndigoSubmitButtonProps) => {
    const [showDialog, setShowDialog] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [showTitles, setShowTitles] = useState([]);
    const [responses, setResponses] = useState([]);

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

      const ProductResponses = () => {
        return (
            <div style={{border: '1px solid #ccc', margin: '10px', padding: '10px'}}>
                {showTitles.map((product, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
                        <p style={{ margin: 0, padding: '5px', flexGrow: 1 }}>
                            {product || 'Unnamed Product'}
                        </p>
                        {responses[index] == 'Success' ? (
                            <i className="pi pi-check" style={{fontSize: '2em', color: 'green'}}></i> // Success icon
                        ) : (
                            <i className="pi pi-times" style={{fontSize: '2em', color: 'red'}}></i> // Failure icon
                        )}
                    </div>
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

    const handleClick = async (products: any[], URL) => {
        setShowDialog(true);

        // Ensure products is always an array
        const productsArray = Array.isArray(products) ? products : [products];
    
        let formatProduct = {
            products: productsArray.map(product => {
                const bullets = parseBullets(product.bullets);
                return {
                    "Product Name": product?.Product_Title,
                    "GTIN": product?.UPC,
                    "Marketing Copy": product?.description,
                    ...bullets,
                }
            })
        }
    
        const response = await axios.post(URL + 'update-products', formatProduct);

        setResponses(productsArray?.map((product, index) => {
            let pResponse = response.data.responseData.ResultsByActionType.ProductImportData[index].Result
            return pResponse || 'Unnamed Product'
        }));
        setShowDialog(false);
        setShowResult(true);
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

            <Dialog
                visible={showResult}
                style={{ width: '30vw', height: '15vw' }}
                onHide={() => setShowResult(false)}
            > 
                {ProductResponses()}
                <Button
                    className="p-button-danger ml-3 my-3 align-items-end"
                    icon="pi pi-ban"
                    label="Close"
                    onClick={() => setShowResult(false)}
                />
                
            </Dialog>
        </>
    )};