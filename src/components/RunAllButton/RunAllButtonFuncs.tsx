import axios from "axios";


export const generateDescriptions = async (
    productArray: any[], 
    setLoading: Function, 
    setProducts: Function, 
    URL: string, 
    setGenerated: Function,
    setError: Function,
    ) => {
    setLoading(true);
    return Promise.allSettled(productArray.map((product, index) => {
        if (product.DescPrompt && product.BulletPrompt) {
            return handleAIRequest(product, index, URL, setLoading, setError )
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
        setProducts(newProducts);
        setGenerated(true);
    }).catch(e => { console.log({failed: e})}); // TODO: More robust error handling
}

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