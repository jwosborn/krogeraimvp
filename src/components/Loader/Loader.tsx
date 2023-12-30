import React, { useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { CSVToArray } from '../../utils/format';
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";

type LoaderProps = {
    loading: boolean,
    setLoading: (value: boolean) => void,
};

export const Loader = ({ loading, setLoading }: LoaderProps) => {

    return (
        <>
            <Dialog className="h-12rem" header="Generating Amazing Content..." visible={loading} closable={false} onHide={() => setLoading(false)}>
                <div className="centered-spinner">
                    <ProgressSpinner />
                </div>
            </Dialog>
        </>
    )};