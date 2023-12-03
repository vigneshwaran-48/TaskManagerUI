import React, { useRef } from 'react'
import { ServerAPIManager } from '../../utility/ServerAPIManager';
import { AppAPI } from '../../api/AppAPI';
import { Common } from '../../utility/Common';

const ImportExport = () => {

    const importFileInputRef = useRef();

    const handleImportButtonClick = () => {
        importFileInputRef.current.click();
    }

    const handleImportFileChange = async () => {
        console.log(importFileInputRef.current.files);
        const formData = new FormData();
        formData.append("data", importFileInputRef.current.files[0]);

        const response = await AppAPI.importData(formData);
        if(response.status === 200) {
            Common.showSuccessPopup(response.message, 2);
            return;
        }
        Common.showErrorPopup(response.error, 2);
    }

    return (
        <div className="import-export-page y-axis-flex">
            <div className="import-export-container y-axis-flex">
                <p>Keep the file safe this contains all your todos information</p>
                <a href={`${ServerAPIManager.ServerURL}${ServerAPIManager.getAppRoutes().settings.export}`}>
                    <button className="common-button export-button">Export</button>
                </a>
            </div>
            <div className="import-export-container y-axis-flex">
                <p>Import the file that you have exported via this app before</p>
                <button 
                    className="common-button import-button"
                    onClick={handleImportButtonClick}
                >Import</button>
                <input 
                    type="file" 
                    accept=".data"
                    id="import-file-input"
                    ref={importFileInputRef}
                    onChange={handleImportFileChange}
                />
            </div>
        </div>
    )
}

export default ImportExport;
