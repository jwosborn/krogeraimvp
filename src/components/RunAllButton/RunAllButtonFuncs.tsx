import axios from "axios";

export const generateDescriptions = async (
    productArray: object[],
    setLoading: Function, 
    setProducts: Function, 
    URL: string, 
    setGenerated: Function,
    setError: Function,
    indexToUpdate?: number 
) => {
    setLoading(true);

    let productsToUpdate: any[];

    if (typeof indexToUpdate === 'undefined') {
        // No specific index provided, update all products
        productsToUpdate = productArray;
    } else {
        // Single index provided
        productsToUpdate = [productArray[indexToUpdate]];
    }

    try {
        const res = await Promise.allSettled(
            productsToUpdate.map(async (product, index) => {
                if (product.DescPrompt && product.BulletPrompt) {
                    return await handleAIRequest(product, typeof indexToUpdate === 'undefined' ? index : indexToUpdate, URL, setLoading, setError);
                }
                return null; // Need to throw invalid request form (or something) error here
            })
        );
        setLoading(false);
        let newProducts = [...productArray];
        // return array of arrays bc formattedAIResponse returns an array each time
        // need to just add the products to the array then set that array in state once that's all done.
        res.forEach((response, i) => {
            if (response.status === 'fulfilled' && response.value) {
                newProducts[response.value.index] = {
                    ...newProducts[response.value.index],
                    ...formattedAIResponse([newProducts[response.value.index]], response.value)
                };
            }
        });
        setProducts(preProducts => {
            return newProducts
        });
        setGenerated(true);
    } catch (e) {
        console.error({ failed: e });
        setError(e);
    }
};

export const handleAIRequest = async (
    product: any,
    index: number,
    URL: string,
    setLoading: Function,
    setError: Function
  ) => {
    const { DescPrompt, BulletPrompt } = product;
    try {
        const descRes = await axios.post(URL, { prompt: DescPrompt });
        const bulletRes = await axios.post(URL, { prompt: BulletPrompt });
  
        return {
            index,
            description: descRes.data[0].message.content,
            bullets: bulletRes.data[0].message.content,
        };
    } catch (e) {
    displayAPIError(e, setLoading, setError);
    throw e; // Rethrow error for higher-level error handling
    }   
};

export const formattedAIResponse = (newProductsArr: any[], response: any) => {
    return{
            ...newProductsArr[response.index],
            description: response.description,
            bullets: response.bullets
        };
};

export const displayAPIError = (e: any, setLoading: Function, setError: Function): void => {
    setLoading(false);
    setError(true);
    console.error(e)
    // setErrorText(e.response.data)
}