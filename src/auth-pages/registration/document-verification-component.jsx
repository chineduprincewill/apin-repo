import React, { useEffect, useState } from 'react'
import ButtonLoader from '../../components/button-loader'
import Tesseract from 'tesseract.js'
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { extractText, ocrPDF, verifyPdf } from '../../utils/pdfExtractor';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;


const DocumentVerificationComponent = ({ docToVerify, setVerified, document, fields}) => {

    const [matchValue, setMatchValue] = useState();
    const [update, setUpdate] = useState();


    const filterDocumentVerificationFields = () => {
        if (document?.validation_texts !== null) {
            let vals = [];
            const v_array = JSON.parse(document?.validation_texts)
            //const field = fields.find(fld => fld.question_code === "1.6")
            v_array.map(item => {
                fields.find(fld => fld.question_code === item) &&
                vals.push(fields.find(fld => fld.question_code === item)?.answer)
            })
            setMatchValue(vals);
        }
        else{
            setUpdate('matched');
        }
    }
    
    useEffect(() => {
        filterDocumentVerificationFields()
    }, [])

    useEffect(() => {
        matchValue && matchValue.length > 0 && setVerified(verifyPdf(docToVerify, matchValue, setUpdate))
    }, [matchValue])

    useEffect(() => {
        update && setVerified(update)
    }, [update])

    //console.log(docToVerify, document, matchValue);
    //console.log(fields);

    return (
        <ButtonLoader loadingText={`Verifying document...`} />
    )
}

export default DocumentVerificationComponent