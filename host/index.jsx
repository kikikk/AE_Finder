/**
 * AE Finder - ExtendScript Host
 * 处理与After Effects的交互
 */

// 导入单个文件
function importFile(filePath) {
    try {
        var file = new File(filePath);
        if (!file.exists) {
            return JSON.stringify({ success: false, error: "文件不存在" });
        }
        
        var importOptions = new ImportOptions(file);
        var item = app.project.importFile(importOptions);
        
        return JSON.stringify({
            success: true,
            name: item.name,
            id: item.id
        });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.toString() });
    }
}

// 导入PNG序列
function importSequence(firstFilePath) {
    try {
        var file = new File(firstFilePath);
        if (!file.exists) {
            return JSON.stringify({ success: false, error: "文件不存在" });
        }
        
        var importOptions = new ImportOptions(file);
        importOptions.sequence = true;
        
        var item = app.project.importFile(importOptions);
        
        return JSON.stringify({
            success: true,
            name: item.name,
            id: item.id,
            duration: item.duration,
            frameRate: item.frameRate
        });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.toString() });
    }
}

// 导入多个文件
function importFiles(filePathsJSON) {
    try {
        var filePaths = JSON.parse(filePathsJSON);
        var results = [];
        
        for (var i = 0; i < filePaths.length; i++) {
            var file = new File(filePaths[i]);
            if (file.exists) {
                var importOptions = new ImportOptions(file);
                var item = app.project.importFile(importOptions);
                results.push({
                    success: true,
                    name: item.name,
                    path: filePaths[i]
                });
            } else {
                results.push({
                    success: false,
                    path: filePaths[i],
                    error: "文件不存在"
                });
            }
        }
        
        return JSON.stringify({ success: true, results: results });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.toString() });
    }
}

// 获取项目信息
function getProjectInfo() {
    try {
        if (!app.project) {
            return JSON.stringify({ success: false, error: "没有打开的项目" });
        }
        
        return JSON.stringify({
            success: true,
            name: app.project.file ? app.project.file.name : "未保存",
            numItems: app.project.numItems
        });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.toString() });
    }
}

// 添加到当前合成
function addToActiveComp(filePath) {
    try {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return JSON.stringify({ success: false, error: "请先选择一个合成" });
        }
        
        var file = new File(filePath);
        if (!file.exists) {
            return JSON.stringify({ success: false, error: "文件不存在" });
        }
        
        var importOptions = new ImportOptions(file);
        var item = app.project.importFile(importOptions);
        var layer = comp.layers.add(item);
        
        return JSON.stringify({
            success: true,
            name: layer.name,
            layerIndex: layer.index
        });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.toString() });
    }
}
