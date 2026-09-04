import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import Tesseract from "tesseract.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const normalizeText = (text) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");
}

/**
 * Extract text from searchable PDF.
 */
export async function extractText(file) {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
    }).promise;

    let text = "";

    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
        const page = await pdf.getPage(pageNo);

        const content = await page.getTextContent();

        text +=
            content.items
                .map((item) => item.str)
                .join(" ") + "\n";
    }

    return {
        pdf,
        text,
    };
}

/**
 * OCR every page of a scanned PDF.
 */
export async function ocrPDF(pdf, onProgress = () => {}) {
    let fullText = "";

    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {

        onProgress({
            page: pageNo,
            totalPages: pdf.numPages,
            status: "Rendering page..."
        });

        const page = await pdf.getPage(pageNo);

        const viewport = page.getViewport({
            scale: 2.5,
        });

        const canvas = document.createElement("canvas");

        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: context,
            viewport,
        }).promise;

        const image = canvas.toDataURL("image/png");

        onProgress({
            page: pageNo,
            totalPages: pdf.numPages,
            status: "Running OCR..."
        });

        const result = await Tesseract.recognize(
            image,
            "eng",
            {
                logger: (m) => {
                    if (m.status === "recognizing text") {
                        onProgress({
                            page: pageNo,
                            totalPages: pdf.numPages,
                            progress: m.progress,
                            status: "Recognizing..."
                        });
                    }
                },
            }
        );

        fullText += result.data.text + "\n";
    }

    return fullText;
}


export async function verifyPdf (docToVerify, matchValue, setUpdate) {

    const { pdf, text } = await extractText(docToVerify);

    let finalText = "";

    if (text.trim().length > 0) {

        console.log("Searchable PDF");

        finalText = text;

    } else {

        console.log("Scanned PDF");

        finalText = await ocrPDF(
            pdf,
            (progress) => {
                //console.log(progress);
            }
        );
    }

    //const matched = normalizeText(finalText).includes(normalizeText(matchValue));
    const matched = checkStringsExist(matchValue, normalizeText(finalText))
    console.log(finalText, matchValue, matched);
    //return matched;
    if(matched === 0){
        setUpdate('matched')
    }
    else{
        setUpdate('not matched')
    }
}

export function checkStringsExist(array, targetString) {
    const lowerTarget = targetString.toLowerCase();
    let res = 0
    // Return 1 immediately if any item is missing
    if(array.length > 0){
        for (const item of array) {
            console.log(lowerTarget, normalizeText(item.toLowerCase()));
            if (!lowerTarget.includes(normalizeText(item.toLowerCase()))) {
                res = 1;
            }
        }
    }

    return res;
}
