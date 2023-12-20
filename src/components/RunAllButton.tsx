import React, { useState } from "react";
import axios from "axios";
import { Button } from "primereact/button";

type RunAllButtonProps = {
    URL: string,
    products: object[],
    setProducts: (value: object[]) => void,
    setLoading: (value: boolean) => void,
    setGenerated: (value: boolean) => void,
    setError: (value: boolean) => void,
};



export const RunAllButton = ({ URL, products, setProducts, setLoading, setGenerated, setError }: RunAllButtonProps) => {

    const generateDesciptions:  (productArray: any[]) => Promise<void> =
    async (productArray) => {
        setLoading(true);
        return Promise.allSettled(productArray.map((product, index) => {
            if (product.DescPrompt && product.BulletPrompt) {
                return handleAIRequest(product, index)
            }
            return null
        }))
        .then(async (res: any) => {
            setLoading(false);
            let newProducts = [...productArray];
            // return array of arrays bc formattedAIResponse returns an array each time
            // need to just add the products to the array then set that array in state once that's all done.
            await res?.forEach(response => {
                newProducts[response.value.index] = formattedAIResponse(newProducts, response.value);
            });
            console.log(newProducts)
            setProducts(newProducts);
            setGenerated(true);
        }).catch(e => { console.log({failed: e})}); // TODO: More robust error handling
    }

    const handleAIRequest:(product: any, index: number) => any =
    async (product, index) => {
        const { DescPrompt, BulletPrompt } = product;
        return OpenAIResponse(URL, DescPrompt)
            .then((descRes: any) => OpenAIResponse(URL, BulletPrompt)
                .then((bulletRes: any) => {
                    return ({
                        index,
                        description: descRes.data[0].message.content,
                        bullets: bulletRes.data[0].message.content
                    })
                })
                .catch(e => { displayAPIError(e) }) // TODO: More robust error handling
            )
    };

    const OpenAIResponse: (url: string, prompt: string) => Promise<Object> =
    (url: string, prompt: string) => axios.post(url, { prompt });

    const formattedAIResponse: (newProductsArr: any[], response: any) => any[] =
    (newProductsArr, response) => {
        return {
                ...newProductsArr[response.index],
                description: response.description,
                bullets: response.bullets
            }
    };

    const displayAPIError: (e: any) => void =
    (e) => {
        setLoading(false);
        setError(true);
        console.error(e)
        // setErrorText(e.response.data)
    }

    return (
        <>
            <Button
                className="p-button-primary generate-button mt-3 ml-3"
                icon="pi pi-check"
                label="Run All Descriptions"
                onClick={() => generateDesciptions(products)}
            />
</>
    )};