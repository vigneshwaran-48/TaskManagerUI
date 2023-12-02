import React from 'react'
import { ServerAPIManager } from '../../utility/ServerAPIManager';

const ImportExport = () => {
    return (
        <div className="import-export-page x-axis-flex">
            <a href={`${ServerAPIManager.ServerURL}${ServerAPIManager.getAppRoutes().settings.export}`}>
                <button className="common-button export-button">Export</button>
            </a>
        </div>
    )
}

export default ImportExport;
